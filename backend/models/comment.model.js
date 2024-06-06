const mongoose = require('mongoose');
const Like = require('./like.model');

const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new mongoose.Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  post: {
    type: ObjectId,
    required: true,
    ref: 'Post',
    index: true,
  },

  content: {
    type: String,
    required: true,
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
});

CommentSchema.statics.getCommentsAndLikes = async function (userId, postId) {
  const comments = await this.find({ post: postId })
    .populate('author', 'userName profileImage')
    .sort('-created')
    .exec();

  const commentIds = comments.map((comment) => comment._id);

  const likedDocs = await Like.find({
    user: userId,
    comment: { $in: commentIds },
  });
  const likedStatus = {};

  commentIds.forEach((id) => {
    likedStatus[id.toString()] = false;
  });

  likedDocs.forEach((doc) => {
    likedStatus[doc.comment.toString()] = true;
  });

  const enrichedComments = comments.map((comment) => ({
    ...comment.toObject(),
    isLiked: likedStatus[comment._id.toString()] || false,
  }));

  return enrichedComments;
};
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
