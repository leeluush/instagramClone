const Comment = require('../models/comment.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../middleware/appError');

exports.getCommentsByPostId = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  if (!postId) {
    return new AppError('postId is required', 400);
  }

  const comments = await Comment.getCommentsAndLikes(userId, postId);

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.createComment = catchAsync(async (req, res) => {
  const user = req.user.id;
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json({ message: 'postId is required' });
  }

  const comment = new Comment({
    content: req.body.content,
    author: user,
    post: postId,
  });

  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('author', 'userName profileImage')
    .exec();

  if (!populatedComment) {
    return new AppError('Comment not found after creation', 404);
  }
  res
    .status(201)
    .json({ message: 'Comment created successfully', data: populatedComment });
});

exports.removeComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId).exec();

  if (!comment) {
    return new AppError('No comment with this id was found', 404);
  }

  await Comment.deleteOne({ _id: commentId }).exec();
  res.status(200).json({ message: 'Comment removed successfully' });
});

exports.updateComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user.id;
  const { comment: commentContent } = req.body;

  const comment = await Comment.findById(commentId).exec();

  if (!comment) {
    return new AppError('No comment with this id was found', 404);
  }

  if (comment.author.toString() !== user) {
    return new AppError('User is not authorized to update this comment', 403);
  }

  await Comment.updateOne(
    { _id: commentId, author: user },
    { $set: { content: commentContent } },
  ).exec();

  const updatedComment = await Comment.findById(commentId).exec();

  res.json({ message: 'Comment updated successfully', data: updatedComment });
});
