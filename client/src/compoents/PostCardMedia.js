import React from "react";
import { CardMedia } from "@mui/material";

function PostCardMedia({ media }) {
  return (
    <CardMedia
      component="img"
      height="194"
      image={media}
      alt="media"
    />
  );
}

export default PostCardMedia;
