import React from "react";
import { useState } from "react";
import PostCardHeader from "./PostCardHeader";
import PostCardMedia from "./PostCardMedia";
import PostContent from "./PostContent";
import PostInteractions from "./PostInteractions";
import PostCommentDialog from './PostCommentDialog';


import { Collapse, IconButton, Card, CardActions, List } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Comment from "./Comment";
import "./Post.css";


function Post({ post }) {
  const { thumbnail, _id, content, comments } = post;
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); 

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  };

  return (
    <Card className="post">
      <PostCardHeader post={post} />
      <PostCardMedia media={thumbnail} />
      <PostInteractions postId={_id} handleDialogOpen={handleDialogOpen}/>
      <PostContent content={content}></PostContent>
      <CardActions disableSpacing>
       
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <PostCommentDialog open ={dialogOpen} handleClose ={handleDialogClose} post={post} postId={_id}/>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
        
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </List>
      </Collapse>
    </Card>
  );
}
export default Post;
