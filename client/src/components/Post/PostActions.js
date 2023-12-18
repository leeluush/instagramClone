import React from "react";
import { useContext } from "react";
import { CardContent, CardActions, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import TelegramIcon from "@mui/icons-material/Telegram";
import { toggleLike } from "../../services/api.likes";
import { AuthContext } from "../Auth/AuthContext";

function PostActions({
  postId,
  handleDialogOpen,
  likeCount,
  isLiked,
  updateLikeCount,
}) {
  // const { likes, liked, handleLike } = usePostLikes(postId, likeCount, isLiked);
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
      <CardActions>
        <FavoriteBorderIcon
          onClick={handleLikeAndUpdate}
          style={{ color: isLiked ? "red" : "inherit" }}
        />
        <ChatBubbleOutlineIcon onClick={handleDialogOpen} />
        <TelegramIcon />
      </CardActions>
      <Typography variant="body2" color="textSecondary" className="post-likes">
        {postLikes}
      </Typography>
    </CardContent>
  );
}

export default PostActions;
