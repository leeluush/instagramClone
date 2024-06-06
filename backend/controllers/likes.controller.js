const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../middleware/appError');

exports.likeComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.params;

  const existingLike = await Like.findOne({
    user: userId,
    comment: commentId,
  });

  if (!commentId) {
    return next(new AppError('Comment ID is missing', 400));
  }

  if (existingLike) {
    return next(new AppError('Already liked this comment', 400));
  }

  const like = new Like({ user: userId, comment: commentId });
  const savedLike = await like.save();

  if (!savedLike) {
    return next(new AppError('Faild to like this comment', 500));
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likes: 1 } },
    { new: true, runValidators: true },
  );

  if (!updatedComment) {
    return next(new AppError(`Comment with ID ${commentId} not found`, 404));
  }

  const likeCount = await Like.countDocuments({ comment: commentId });
  return res
    .status(200)
    .json({ message: 'Like created successfully', likeCount });
});

exports.unlikeComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.params;

  if (!commentId) {
    return next(new AppError('Comment ID is missing', 400));
  }

  const existingLike = await Like.findOne({
    user: userId,
    comment: commentId,
  });

  if (!existingLike) {
    return next(new AppError('You have not liked this comment yet', 404));
  }

  await Like.findOneAndRemove({ user: userId, comment: commentId });

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likes: -1 } },
    { new: true, runValidators: true },
  );

  if (!updatedComment) {
    return next(new AppError(`Comment with ID ${commentId} not found`, 404));
  }

  const likeCount = await Like.countDocuments({ comment: commentId });
  return res
    .status(200)
    .json({ message: 'Like deleted successfully', likeCount });
});

exports.checkLikeComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.params;
  const like = await Like.findOne({ user: userId, comment: commentId });
  res.status(200).json({ liked: !!like });
});

exports.likePost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  const existingLike = await Like.findOne({ user: userId, post: postId });

  if (existingLike) {
    await Like.findOneAndRemove({ user: userId, post: postId });
    const likeCount = await Like.countDocuments({ post: postId });
    return res.status(200).json({ message: 'Like toggled off', likeCount });
  }
  const like = new Like({ user: userId, post: postId });
  await like.save();
  const likeCount = await Like.countDocuments({ post: postId });
  return res
    .status(200)
    .json({ message: 'Like created successfully', likeCount });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  await Like.findOneAndDelete({ user: userId, post: postId });
  const likeCount = await Like.countDocuments({ post: postId });
  res.status(200).json({ message: 'Like deleted successfully', likeCount });
});

exports.getLikesCountPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const likesCount = await Like.countDocuments({ post: postId });
  res.status(200).json({ likesCount });
});

exports.getLikesCountComments = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const likesCount = await Like.countDocuments({ comment: commentId });
  res.status(200).json({ likesCount });
});

exports.checkLikePost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const { postId } = req.params;
  const like = await Like.findOne({ user: userId, post: postId });
  res.status(200).json({ liked: !!like });
});
