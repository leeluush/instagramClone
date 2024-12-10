const AppError = require('../middleware/appError');
const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');

exports.getFeed = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const feed = await Post.fetchFeed(userId);

  if (!feed || feed.length === 0) {
    return next(new AppError('No posts found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: feed,
  });
});
