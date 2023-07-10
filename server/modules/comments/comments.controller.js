const Post = require('../posts/post.model');
const User = require('../users/user.model');
const Comment = require('../comments/comment.model')


async function getCommentsByPostId(req, res) {
    const postId = req.params.postId
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }
    
  try {

    const comments = await Comment.find({ post: postId })
      .populate("author", "profileImage")
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
    const userId = req.user.id;

    const comment = await Comment
    .findById(commentId)
    .exec()

    if(!comment) {
      return res.status(404).json({message: "Comment not found"})
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({message: "User is not authorized to delete the this comment"})
    }

    await Comment
      .deleteOne({ _id: commentId })
      .exec()
      res.json({ message: "Comment removed successfully" });

  } catch (error) {
    res.status(500).json({ message: "An error occurred while removing the comment" });

  }

}


async function updateComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id
    const commentContent = req.body.comment;

    const comment = await Comment
    .findById(commentId)
    .exec()

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({message: "User is not authorized to update the this comment"})
    }

    await Comment.updateOne(
      { _id: commentId, author: userId },
      { $set: { content: commentContent } }).exec();

      const updatedComment = await Comment.findById(commentId).exec();
      res.json({ message: "Comment updated successfully", data: updatedComment });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the comment", error });
  }
}



module.exports = {
  getCommentsByPostId,
  createComment,
  removeComment,
  updateComment
}