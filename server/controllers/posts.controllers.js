const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');

const getPosts = asyncHandler(async function(req, res) {
  const posts = await Post.find()
    .sort('-created')
    .limit(50)
    .select('author category title content thumbnail coverImage likes created updated')
    .populate('category')
    .populate('author', 'firstName lastName profileImage userName')
    .populate('comments')
    .exec();

  res.json(posts);
});

const getPostById = asyncHandler(async function(req, res) {
  const postId = req.params.postId;
  const post = await Post
    .findOne({ _id: postId, author: req.user._id })
    .exec();

  res.json(post);
});

const createPost = asyncHandler(async function(req, res) {
  const body = req.body;
  const post = new Post(body);

  post.author = req.user._id;

  await post.save();
  res.status(201).json({ message: "Post created successfully", data: post });
});

const removePost = asyncHandler(async function(req, res) {
  const postId = req.params.postId;
  await Post
    .deleteOne({ _id: postId, author: req.user._id })
    .exec();
  res.json({ message: "Post removed successfully" });
});

const updatePost = asyncHandler(async function(req, res) {
  const postId = req.params.postId;
  const content = req.body.content;
  await Post.updateOne(
    { _id: postId, author: req.user._id },
    { $set: { content: content } }).exec();
  res.json({ message: "Post updated successfully", data: content });
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  removePost,
  updatePost
}
