const Post = require('../models/post');
const User = require('../models/user');


async function getPosts(req, res) {
  try {

    const posts = await Post
      .find({ author: req.user._id })
      .sort('-created')
      .limit(50)
      .select('author category title created')
      .populate('category')
      .populate('author', 'fullName username')

      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });

  }
}

async function getSinglePost(req, res) {
  try {
    const postId = req.params.postId;
    const post = await Post
      .findOne({ _id: postId, author: req.user._id })
      .exec();

    res.json(post);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}

async function createPost(req, res) {

  const body = req.body;
  const post = new Post(body);

  post.author = req.user._id;

  try {
    await post.save();
    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "An error occurred while creating the post" });
  }
}


async function removePost(req, res) {
  try {
    const postId = req.params.postId;
    await Post
      .deleteOne({ _id: postId, author: req.user._id })
      .exec()
      res.json({ message: "Post removed successfully" });


  } catch (error) {
    res.status(500).json({ message: "An error occurred while removing the post" });

  }

}


async function updatePost(req, res) {
  try {
    const postId = req.params.postId;
    const content = req.body.content;
     await Post.updateOne(
      { _id: postId, author: req.user._id },
      { $set: { content: content } }).exec();
      res.json({ message: "Post updated successfully", data: content });
    } catch (error) {
      res.status(500).json({ message: "An error occurred while updating the post" });
    }
}



module.exports = {
  getPosts,
  getSinglePost,
  createPost,
  removePost,
  updatePost
}