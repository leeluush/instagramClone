import React from "react";
import { IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import "./PostActions.css";

function PostActions({ handleDialogOpen, likeCount, isLiked, onLike }) {
  const postLikes = typeof likeCount === "number" ? `${likeCount} likes` : "Loading likes...";

  return (
    <div className="post-actions-container">
      <div className="post-actions-icons" style={{marginLeft: '0px' }}>
        <IconButton onClick={onLike} className="icon-button" aria-label={isLiked ? "Unlike" : "Like"} style={{paddingLeft: '0px'}}>
          {isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon  />}
        </IconButton>
        <IconButton onClick={handleDialogOpen} className="icon-button" aria-label="Comment">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton className="icon-button" aria-label="Share">
          <TelegramIcon />
        </IconButton>
      </div>
      <Typography variant="body2" color="textPrimary" className="post-likes">
        <strong>{postLikes}</strong>
      </Typography>
    </div>
  );
}

export default PostActions;
