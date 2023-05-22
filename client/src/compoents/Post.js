import React from "react";
import { Avatar, Card, CardHeader, CardMedia, CardContent, CardActions, List } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import Comment from "./Comment";
import "./Post.css";



function PostHeader({ post }) {
  if (!post || !post.author) return null;
  const { userName, profileImage } = post.author;


  const date = new Date(post.created);
  const createdTime = date.toDateString();

  return (
    <CardHeader
      avatar={<Avatar alt={userName} src={profileImage} />}
      title={userName}
      subheader={createdTime}
    />
  );
}

function PostMedia({ media }) {
  return (
    <CardMedia
      component="img"
      height="194"
      image={media}
      alt="media"
    />
  );
}

function PostInteractions({ likesNumber, content }) {
  return (
    <CardContent>
      <CardActions>
        <FavoriteBorderIcon />
        <ChatBubbleOutlineIcon />
        <TelegramIcon />
      </CardActions>
      <p className="post-likes">{likesNumber} likes</p>
      <p className="post-content">{content}</p>

    </CardContent>
  );
}



function Post({ post }) {
  const {
    thumbnail,
    likes,
    content, comments } = post;
    console.log(post);

  return (
    <Card className="post">
      <PostHeader post={post} />
      <PostMedia media={thumbnail} />
      <PostInteractions likesNumber={likes} content={content} />
      <List>
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </List>

    </Card>
  );
}
export default Post;
