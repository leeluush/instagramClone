import React from "react";
import { CardMedia } from "@mui/material";

function PostCardMedia({ media }) {
  return (
    <CardMedia
      component="img"
      height="auto"
      image={media}
      alt="media"
      style={{ height: '100%', width: '100%', objectFit: 'cover' }}

    />
  );
}

export default PostCardMedia;
