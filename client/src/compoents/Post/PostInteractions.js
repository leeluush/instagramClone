import React from "react";
import { CardContent, CardActions, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import {usePostLikes} from '../../services/api.likes'

function PostInteractions({ postId, handleDialogOpen }) {
  const { likes, liked, handleLike } = usePostLikes(postId);

  return (
    <CardContent>
      <CardActions>
        {liked ? (
          <FavoriteBorderIcon onClick = { handleLike } style={{ color : 'red'}} />
        ) : (
          <FavoriteBorderIcon  onClick={ handleLike }/>
        )}
        <ChatBubbleOutlineIcon onClick={handleDialogOpen} />
        <TelegramIcon />
      </CardActions>
     
      {typeof likes === 'number' ? (
        <Typography variant="body2" color="textSecondary" className="post-likes">
          {likes} likes
        </Typography>
      ) : (
        <Typography variant="body2" color="textSecondary" className="post-likes">
          Loading likes...
        </Typography>
      )}
  
    </CardContent>
  );
}


export default PostInteractions
