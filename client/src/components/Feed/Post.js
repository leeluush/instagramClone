import React, { useState, useContext } from "react";
import { Button, IconButton, Typography, TextField, Box } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendIcon from "@mui/icons-material/Send";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import PostHeader from "../Post/PostHeader";
import PostMedia from "../Post/PostMedia";
import PostContent from "../Post/PostContent";
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
    setComment(e.target.value);
  };

  const handleEmojiSelect = (emoji) => {
    setComment((prev) => prev + emoji.native);
  };

  return (
    <div className="post">
      <PostHeader
        post={post}
        handleFollowToggle={() => handleFollowToggle(user._id, author._id)}
        handlePostDeletion={handlePostDeletion}
        isFollowing={followedUsers[author._id]}
        sx={{
          padding: "8px 4px 8px 12px",
          borderBottom: "1px solid rgb(239, 239, 239)",
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
          },
        }}
      />

      <PostMedia
        media={media}
        sx={{
          width: "100%",
          display: "block",
        }}
      />

      <div className="post-actions">
        <div className="action-buttons-left">
          <IconButton
            onClick={handleLike}
            sx={{
              p: 1,
              color: liked ? "#ed4956" : "inherit",
            }}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton onClick={() => setDialogOpen(true)} sx={{ p: 1 }}>
            <ChatBubbleOutlineRoundedIcon />
          </IconButton>
          <IconButton sx={{ p: 1 }}>
            <SendIcon />
          </IconButton>
        </div>
        <IconButton sx={{ p: 1 }}>
          <BookmarkBorderIcon />
        </IconButton>
      </div>

      <Typography className="likes-count">{likes} likes</Typography>

      <PostContent
        content={post.content}
        author={author}
        sx={{
          padding: "0 12px",
          marginBottom: "8px",
          fontSize: 14,
          color: "rgb(38, 38, 38)",
          "& .author-name": {
            fontWeight: 600,
            marginRight: "4px",
          },
        }}
      />
      <div className="post-comments-section">
        <Typography
          className="view-comments"
          onClick={() => setDialogOpen(true)}
        >
          View all {comments.length} comments
        </Typography>

        {comments.length > 0 && (
          <div className="first-comment">
            <span style={{ fontWeight: 600, marginRight: "4px" }}>
              {comments[0].author.userName}
            </span>
            {comments[0].content}
          </div>
        )}
      </div>

      <PostDialog
        dialogOpen={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        post={post}
        postId={_id}
        comments={comments}
        deleteComment={removeComment}
        updateComment={updateComment}
      />

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="input-container">
          <TextField
            value={comment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            fullWidth
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: 14,
                "& input": {
                  "&::placeholder": {
                    color: "rgb(142, 142, 142)",
                    opacity: 1,
                  },
                },
              },
            }}
          />
          <div className="action-buttons">
            {comment.trim() && (
              <Button
                type="submit"
                sx={{
                  color: "#0095f6",
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: 0,
                  padding: "8px",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Post
              </Button>
            )}
            <IconButton
              onClick={() => setIsPickerVisible(!isPickerVisible)}
              sx={{
                padding: "8px",
                color: "rgb(142, 142, 142)",
              }}
            >
              <EmojiEmotionsOutlinedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        {isPickerVisible && (
          <div className="emoji-picker-container">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              previewPosition="none"
              skinTonePosition="none"
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Post;
