const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../middleware/appError');

exports.getPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .sort('-created')
    .limit(50)
    .select('author category title content likes created updated media')
    .populate('author', 'firstName lastName profileImage userName')
    .populate('comments')
    .exec();

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId }).exec();

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { caption } = req.body;

  if (!caption || !req.file) {
    throw new AppError('Please add all fields', 400);
  }
  const postMedia = req.file.path;

  const post = await Post.create({
    content: caption,
    media: postMedia,
    mediaType: 'image',
    author: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Post created sucessfully',
    data: post,
  });
});

exports.removePost = catchAsync(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId).exec();

    if (!post) {
      return next(new AppError(`No post found with that ID`, 404));
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'User is not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: postId }).exec();
    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while removing the Post' });
  }
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const postMedia = req.file ? req.file.path : undefined;
  const userId = req.user.id;

  const updateData = { content: content };

  if (!postId) {
    return next(new AppError(`No post found with that ID`, 404));
  }
  if (postMedia) {
    updateData.image = postMedia;
  }

  await Post.updateOne(
    { _id: postId, author: userId },
    { $set: { content: content, media: postMedia } },
  ).exec();
  res.json({ message: 'Post updated successfully', data: content });
});
