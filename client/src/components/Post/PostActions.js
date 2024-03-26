import React from "react";
import { useContext } from "react";
import { CardContent, CardActions, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import { toggleLike } from "../../api/likesApi";
import { AuthContext } from "../Auth/AuthContext";
import "./PostActions.css";

function PostActions({
  postId,
  handleDialogOpen,
  likeCount,
  isLiked,
  updateLikeCount,
}) {
  const { user } = useContext(AuthContext);

  const handleLikeAndUpdate = async () => {
    const newStatus = !isLiked;
    const newLikes = await toggleLike(postId, newStatus, user._id);
    updateLikeCount(postId, newLikes.likeCount, newStatus);
  };

  const postLikes =
    typeof likeCount === "number" ? `${likeCount} likes` : "Loading likes...";

  return (
    <CardContent>
      <CardActions disableSpacing className="post-actions">
        <IconButton onClick={handleLikeAndUpdate} className="icon-button">
          {isLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton onClick={handleDialogOpen} className="icon-button">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton className="icon-button">
          <TelegramIcon />
        </IconButton>
      </CardActions>
      <Typography variant="body2" color="textSecondary" className="post-likes">
        <strong>{postLikes}</strong>
      </Typography>
    </CardContent>
  );
}


export default PostActions;
