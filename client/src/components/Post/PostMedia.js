import React from "react";
import { CardMedia } from "@mui/material";

function PostMedia({ media }) {
  return (
    <div style={{ paddingTop: '125%', position: 'relative', width: '100%' }}>

    <CardMedia
      component="img"
      height="auto"
      image={media}
      alt="Post media"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}

      />
      </div>
  );
}

export default PostMedia;
