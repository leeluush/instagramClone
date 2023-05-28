import React from "react";
import { CardHeader, Avatar } from "@mui/material";

function PostCardHeader({post}) {
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
  
  export default PostCardHeader;