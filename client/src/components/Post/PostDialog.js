import React, { useState, useContext } from "react";
import { IconButton, Button, Typography, Avatar } from "@mui/material";
import PostMedia from "./PostMedia";
import CommentList from "../Feed/CommentList";
import { postComment } from "../../api/commentApi";
import { AuthContext } from "../Auth/AuthContext";
import {
  BookmarkBorder,
  FavoriteBorder,
  ChatBubbleOutline,
  Send,
  MoreHoriz,
  SentimentSatisfiedAlt,
  Close,
} from "@mui/icons-material";
import "./PostDialog.css";

const PostDialog = ({
  dialogOpen,
  handleClose,
  post,
  postId,
  deleteComment,
  comments,
  updateComment,
}) => {
  const { media, content, likeCount, isLiked } = post;
  const { user } = useContext(AuthContext);
  const { userName, profileImage, location } = post.author;
  const [comment, setComment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!post || !user) return;
    try {
      await postComment(postId, comment, user._id);
      setComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  if (!dialogOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="dialog-close-button" onClick={handleClose}>
          <Close />
        </button>

        <div className="dialog-post-container">
          {/* Left - Image Section */}
          <div className="dialog-image-section">
            <PostMedia media={media} />
          </div>

          {/* Right - Content Section */}
          <div className="dialog-content-section">
            {/* Header */}
            <div className="post-header">
              <div className="post-user-info">
                <Avatar src={profileImage} className="post-avatar" />
                <div>
                  <Typography className="post-username">{userName}</Typography>
                  {location && (
                    <Typography className="post-location">
                      {location}
                    </Typography>
                  )}
                </div>
              </div>
              <IconButton className="post-more-options">
                <MoreHoriz />
              </IconButton>
            </div>

            {/* Comments Section */}
            <div className="post-comments-section">
              <CommentList
                postId={postId}
                comments={comments}
                deleteComment={deleteComment}
                updateComment={updateComment}
              />
            </div>

            {/* Engagement Section */}
            <div className="post-engagement-section">
              <div className="post-actions">
                <div className="post-primary-actions">
                  <IconButton>
                    <FavoriteBorder />
                  </IconButton>
                  <IconButton>
                    <ChatBubbleOutline />
                  </IconButton>
                  <IconButton>
                    <Send />
                  </IconButton>
                </div>
                <IconButton>
                  <BookmarkBorder />
                </IconButton>
              </div>

              {likeCount > 0 && (
                <div className="post-likes-count">{likeCount} likes</div>
              )}

              {/* Add Comment Section */}
              <form onSubmit={handleSubmit} className="post-comment-form">
                <IconButton className="post-emoji-button">
                  <SentimentSatisfiedAlt />
                </IconButton>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="post-comment-input"
                />
                {comment.trim() && (
                  <button type="submit" className="post-submit-button">
                    Post
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDialog;
