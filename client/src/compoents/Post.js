import React from "react";
import PostCardHeader from "./PostCardHeader";
import PostCardMedia from "./PostCardMedia";
import PostContent from "./PostContent";
import PostInteractions from "./PostInteractions";

import { Collapse, IconButton, Card, CardActions, List } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Comment from "./Comment";
import "./Post.css";


function Post({ post }) {
  const {
    thumbnail,
    _id,
    content, comments } = post;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="post">
      <PostCardHeader post={post} />
      <PostCardMedia media={thumbnail} />
      <PostInteractions postId={_id} />
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
