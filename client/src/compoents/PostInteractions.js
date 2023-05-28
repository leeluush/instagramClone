import React from "react";
import { CardContent, CardActions } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';



function PostInteractions({ likesNumber }) {
    return (
      <CardContent>
        <CardActions>
          <FavoriteBorderIcon />
          <ChatBubbleOutlineIcon />
          <TelegramIcon />
        </CardActions>
        <p className="post-likes">{likesNumber} likes</p>
      </CardContent>
    );
  }
  
  export default PostInteractions