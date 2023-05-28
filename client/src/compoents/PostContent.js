import React from "react";
import { CardContent } from "@mui/material";


function PostContent({ content }) {
  return (
  <CardContent>
          <p className="post-content">{content}</p>
  </CardContent>
  )
}

export default PostContent; 
