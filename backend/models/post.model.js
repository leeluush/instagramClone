const mongoose = require('mongoose');
const Follower = require('./follower.model');
const Like = require('./like.model');

const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },

  title: {
    type: String,
    required: false,
  },

  content: {
    type: String,
    required: true,
  },

  media: {
    type: String,
    required: true,
  },

  mediaType: {
    type: String,
    required: true,
  },

  thumbnail: {
    type: String, // this will be the thumbnail image for both image and video posts
  },

  // TODO : remove this once the like feature is working
  likes: {
    type: Number,
    default: 0,
  },

  created: {
    type: Date,
    default: Date.now,
  },

  updated: {
    type: Date,
    default: Date.now,
  },

  comments: [
    {
      type: ObjectId,
      ref: 'Comment',
    },
  ],
});

async function fetchFollowingIds(userId) {
  const followingDocs = await Follower.find({ user: userId });
  return followingDocs.map((doc) => doc.followee);
}

async function fetchLikeCounts(postIds) {
  const likeCountsArray = await Like.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: '$post', count: { $sum: 1 } } },
  ]);

  const likeCounts = {};
  likeCountsArray.forEach(({ _id, count }) => {
    likeCounts[_id.toString()] = count;
  });
  return likeCounts;
}

async function fetchFollowingStatus(userId, authorIds) {
  const followingDocs = await Follower.find({
    user: userId,
    followee: { $in: authorIds },
  });
  const followingStatus = {};

  followingDocs.forEach((doc) => {
    followingStatus[doc.followee.toString()] = true;
  });

  return followingStatus;
}

async function fetchLikedStatus(userId, postIds) {
  const likedDocs = await Like.find({ user: userId, post: { $in: postIds } });
  const likedStatus = {};

  likedDocs.forEach((doc) => {
    likedStatus[doc.post.toString()] = true;
  });

  return likedStatus;
}

PostSchema.statics.fetchFeed = async function (userId, page = 1, limit = 20) {
  const followingIds = await fetchFollowingIds(userId);

  // Fetch limited number of posts sorted by created timestamp
  let posts = await this.find({ author: { $in: followingIds } })
    .sort({ created: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .populate([
      { path: 'author', select: 'firstName lastName profileImage userName' },
    ])
    .exec();

  const minimumThreshold = 5;

  if (posts.length < minimumThreshold) {
    const additionalPostsNeeded = minimumThreshold - posts.length;
    const topLikedOrRecentPosts = await this.find({
      _id: { $nin: posts.map((post) => post._id) },
    })
      .sort({ likes: -1, created: -1 })
      .limit(additionalPostsNeeded)
      .lean()
      .populate([
        { path: 'author', select: 'firstName lastName profileImage userName' },
      ])
      .exec();
    posts = [...posts, ...topLikedOrRecentPosts];
  }

  const postIds = posts.map((post) => post._id);
  const authorIds = posts.map((post) => post.author._id);

  const likeCounts = await fetchLikeCounts(postIds);
  const followingStatus = await fetchFollowingStatus(userId, authorIds);
  const likedStatus = await fetchLikedStatus(userId, postIds);

  // Add like counts, following status, and weight to each post
  posts = posts.map((post) => {
    let weight = 0;
    weight += 100;
    weight += (new Date() - new Date(post.created)) / (1000 * 60);
    weight += likeCounts[post._id.toString()] || 0;

    return {
      ...post,
      weight,
      likeCount: likeCounts[post._id.toString()] || 0,
      isFollowing: followingStatus[post.author._id.toString()] || false,
      isLiked: likedStatus[post._id.toString()] || false,
    };
  });

  // Sort posts based on weight
  posts.sort((a, b) => b.weight - a.weight);

  const hasMore = await this.countDocuments({
    author: { $in: followingIds },
  }).then((count) => count > page * limit);

  return { posts, nextPage: hasMore ? page + 1 : null };
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
