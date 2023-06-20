const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment')


async function getCommentsByPostId(req, res) {
    const postId = req.params.postId
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }
    
  try {

    const comments = await Comment.find({ post: postId })
      .populate('author', "profileImage userName")
    
      .sort('-created')
      .exec();

    res.json(comments)
  } catch (error) {
  console.log(error);
  res.status(500).json({ message: error.message });
}
}

async function createComment (req, res) {
  const body = req.body;

  if (!body.postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  const comment = new Comment(body);
  comment.author = req.user.id;
  comment.post = body.postId;


  try {
    await comment.save();
    res.status(201).json({ message: "Comment created successfully", data: comment });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "An error occurred while creating the comment" });
  }
}


async function removeComment(req, res) {
  try {
    const commentId = req.params.commentId;
    await Comment
      .deleteOne({ _id: commentId, author: req.user._id })
      .exec()
    res.json({ message: "Comment removed successfully" });


  } catch (error) {
    res.status(500).json({ message: "An error occurred while removing the comment" });

  }

}


async function updateComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id

    const comment = req.body.comment;
    await Comment.updateOne(
      { _id: commentId, author: req.user._id },
      { $set: { content: commentContent } }).exec();
    res.json({ message: "Comment updated successfully", data: comment });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the comment" });
  }
}



module.exports = {
  getCommentsByPostId,
  createComment,
  removeComment,
  updateComment
}