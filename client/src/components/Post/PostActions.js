import React from "react";
import { IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import "./PostActions.css";

function PostActions({ handleDialogOpen, likeCount, isLiked, onLike }) {
  return (
    <div className="post-actions">
      <div className="actions-left">
        <IconButton
          onClick={onLike}
          className={`action-button ${isLiked ? "liked" : ""}`}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton onClick={handleDialogOpen} className="action-button">
          <ChatBubbleOutlineRoundedIcon />
        </IconButton>
        <IconButton className="action-button">
          <SendOutlinedIcon />
        </IconButton>
      </div>
      <div className="actions-right">
        <IconButton className="action-button">
          <BookmarkBorderOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
}
export default PostActions;
