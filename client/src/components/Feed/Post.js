import React, { useState, useContext } from "react";
import {
  Card,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import PostHeader from "../Post/PostHeader";
import PostMedia from "../Post/PostMedia";
import PostContent from "../Post/PostContent";
import PostActions from "../Post/PostActions";
import PostDialog from "../Post/PostDialog";
import useFollowToggle from "../../hooks/useFollowToggle";
import useComments from "../../hooks/useComments";
import { AuthContext } from "../Auth/AuthContext";
import { usePostLikes } from "../../hooks/usePostLikes";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import "./Post.css";

function Post({ post, handlePostDeletion }) {
  const { comments, addComment, updateComment, removeComment } = useComments(
    post.comments
  );
  const { media, _id, author } = post;
  const [comment, setComment] = useState("");
  const [showPostButton, setShowPostButton] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { likes, liked, handleLike } = usePostLikes(
    _id,
    post.likeCount,
    post.isLiked
  );
  const { followedUsers, handleFollowToggle } = useFollowToggle({
    [post.author._id]: post.isFollowing,
  });
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user && post._id && comment.trim()) {
      await addComment(post._id, comment, user._id);
      setComment("");
    }
  };

  const handleCommentChange = (e) => {
    const text = e.target.value;
    setComment(text);
    setShowPostButton(text.length > 0);
  };

  const handleEmojiSelect = (e) => {
    const emoji = e.native;
    setComment((prevComment) => prevComment + emoji);
    setShowPostButton(true);
  };

  return (
    <Card className="post" style={{ border: "none", boxShadow: "none" }}>
      <PostHeader
        post={post}
        handleFollowToggle={() => handleFollowToggle(user._id, post.author._id)}
        handlePostDeletion={handlePostDeletion}
        isFollowing={followedUsers[post.author._id]}
      />
      <PostMedia media={media} />
      <PostActions
        postId={_id}
        likeCount={likes}
        isLiked={liked}
        handleDialogOpen={() => setDialogOpen(true)}
        onLike={handleLike}
      />
      <PostContent content={post.content} author={author} />
      <Typography
        variant="body2"
        color="textSecondary"
        className="view-comments"
        onClick={() => setDialogOpen(true)}
        style={{ cursor: "pointer", marginTop: "5px", marginBottom: "5px" }}
      >
        View all {comments.length} comments
      </Typography>
      {comments.length > 0 && (
        <div className="first-comment">
          <strong>{comments[0].author.userName}: </strong>
          {comments[0].content}
        </div>
      )}
      <PostDialog
        dialogOpen={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        post={post}
        postId={post._id}
        comments={comments}
        deleteComment={removeComment}
        updateComment={updateComment}
      />
      <form onSubmit={handleSubmit} className="comment-form">
        <TextField
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            disableUnderline: false,
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
              padding: 0,
              borderBottom: "dbdbdb",
            },
            endAdornment: (
              <InputAdornment position="end">
                {showPostButton && (
                  <Button
                    type="submit"
                    style={{
                      color: "#3897f0",
                    }}
                  >
                    Post
                  </Button>
                )}
              </InputAdornment>
            ),
          }}
          variant="standard"
          sx={{
            "& .MuiInputBase-input": {
              backgroundColor: "transparent",
              boxShadow: "none",
              border: "none",
              padding: 0,
            },
          }}
        />
        <Button onClick={() => setIsPickerVisible(!isPickerVisible)}>
          <EmojiEmotionsOutlinedIcon
            fontSize="xsmall"
            style={{ color: "gray" }}
          />
        </Button>
        {isPickerVisible && (
          <div className="emoji-picker-container">
            <Picker
              data={data}
              previewPosition="none"
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
        )}
      </form>
    </Card>
  );
}

export default Post;
