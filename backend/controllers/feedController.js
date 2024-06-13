const AppError = require('../middleware/appError');
const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');

exports.getFeed = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const feed = await Post.fetchFeed(userId, page, limit);

  if (!feed || feed.posts.length === 0) {
      return next(new AppError('No posts found', 404));
  }

  // Ensure that only the specified limit of posts are returned in the response
  feed.posts = feed.posts.slice(0, limit);

  res.status(200).json({
      status: 'success',
      total: feed.totalPosts,
      data: feed.posts,
      nextPage: feed.nextPage
  });
});

