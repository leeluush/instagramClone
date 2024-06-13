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

PostSchema.statics.fetchFeed = async function (userId, page = 1, limit = 10) {
  const followingIds = await fetchFollowingIds(userId);

  let posts = await this.find({ author: { $in: followingIds } })
    .sort({ created: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .populate('author', 'firstName lastName profileImage userName');

  if (posts.length < limit) {
    const additionalPostsNeeded = limit - posts.length;
    const topLikedOrRecentPosts = await this.find({ author: { $nin: followingIds } })
      .sort({ likes: -1, created: -1 })
      .skip((page - 1) * limit)
      .limit(additionalPostsNeeded)
      .lean()
      .populate('author', 'firstName lastName profileImage userName');

    posts = [...posts, ...topLikedOrRecentPosts];
  }

  const totalPosts = await this.countDocuments();
  const hasMore = totalPosts > page * limit;

  // Fetch like counts, following status, and liked status for enriched information
  const enrichedPosts = await Promise.all(posts.map(async (post) => {
    const comments = await Comment.find({ post: post._id })
      .sort({ created: -1 })
      .populate('author', 'userName profileImage')
      .lean();

    const likeCount = await fetchLikeCounts([post._id]);
    const followingStatus = await fetchFollowingStatus(userId, [post.author._id]);
    const likedStatus = await fetchLikedStatus(userId, [post._id]);

    // Calculate the weight for sorting
    const ageInHours = (Date.now() - new Date(post.created).getTime()) / (1000 * 3600);
    const weight = (likeCount[post._id.toString()] || 0) - ageInHours;

    return {
      ...post,
      comments,
      likeCount: likeCount[post._id.toString()] || 0,
      isFollowing: followingStatus[post.author._id.toString()] || false,
      isLiked: likedStatus[post._id.toString()] || false,
      weight,
    };
  }));

  // Sort based on the weight
  enrichedPosts.sort((a, b) => b.weight - a.weight);

  return { posts: enrichedPosts, nextPage: hasMore ? page + 1 : null, totalPosts };
};

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
