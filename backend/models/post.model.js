const mongoose = require('mongoose');
const Follower = require('./follower.model');
const Like = require('./like.model');
const Comment = require('./comment.model');

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
    type: String,
  },

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

  let posts = await this.find({ author: { $in: followingIds } })
    .sort({ created: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .populate([
      { path: 'author', select: 'firstName lastName profileImage userName' },
    ])
    .exec();

  // Check if additional posts are needed to meet the minimum threshold
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

  const likeCounts = await fetchLikeCounts(posts.map((post) => post._id));
  const followingStatus = await fetchFollowingStatus(
    userId,
    posts.map((post) => post.author._id),
  );
  const likedStatus = await fetchLikedStatus(
    userId,
    posts.map((post) => post._id),
  );

  // Attach comments to each post
  posts = await Promise.all(
    posts.map(async (post) => {
      const comments = await Comment.find({ post: post._id })
        .sort({ created: -1 })
        .limit(3)
        .populate('author', 'userName profileImage')
        .lean()
        .exec();

      return {
        ...post,
        comments,
        likeCount: likeCounts[post._id.toString()] || 0,
        isFollowing: followingStatus[post.author._id.toString()] || false,
        isLiked: likedStatus[post._id.toString()] || false,
      };
    }),
  );

  // Calculate weights for sorting posts
  posts.forEach((post) => {
    post.weight = 100; // Base weight
    post.weight -= (new Date() - new Date(post.created)) / (1000 * 60 * 60); // Adjust for time decay
    post.weight += post.likeCount || 0; // Adjust for likes
  });

  // Sort posts based on weight
  posts.sort((a, b) => b.weight - a.weight);

  const hasMore =
    (await this.countDocuments({ author: { $in: followingIds } })) >
    page * limit;

  return { posts, nextPage: hasMore ? page + 1 : null };
};

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
