import React from "react";
import { Button,Avatar} from "@mui/material";




function Post({ post }) {
    let { userImage, userName, createdTime, media, likesNumber, content } = post
    return (
      <div className="post">
        <div className="post-header">
          <Avatar alt={userName} src={userImage}></Avatar>
          <span className="post-created-time">{createdTime}</span>
        </div>
        <div className="post-media">
          <img src={media} alt="media" />
        </div>
        <div className="post-interactions">
          <span className="post-likes">{likesNumber} likes</span>
          <span className="post-content">{content}</span>
          <div className="post-actions">
            <Button variant= 'text'>Like</Button>
            <button>Comment</button>
            <button>Share</button>
          </div>
        </div>
      </div>
    );
  }

  export default Post;