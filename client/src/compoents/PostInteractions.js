import React from "react";
import { CardContent, CardActions } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import useLikes from '../services/api.likes'
import { AuthContext } from "./AuthContext";
import { useContext } from "react";




function PostInteractions({ postId }) {
  const { likes, liked, handleLike } = useLikes(postId);
  const { user } = useContext(AuthContext);

    return (
      <CardContent>
        <CardActions>
        {liked ? (
          <FavoriteBorderIcon onClick = { handleLike } style={{ color : 'red'}} />
        ) : (
          <FavoriteBorderIcon  onClick={ handleLike }/>
        )}
        
          <ChatBubbleOutlineIcon />
          <TelegramIcon />
        </CardActions>
        <p className="post-likes">{ likes } likes</p>
      </CardContent>
    );
  }
  
  export default PostInteractions