import React, { useEffect, useState } from "react";
import { apiDeleteComment, fetchComments } from "../../services/api.comments";
import { Collapse, IconButton, Card, CardActions, List } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostDialog from './PostDialog';

import CommentList from "../Comment/CommentList";
import "./Post.css";

function Post({ post }) {
  const { thumbnail, _id, content } = post;
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const deleteComment = async (commentId) => {
    try {
      await apiDeleteComment(commentId);
      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error(`Failed to delete comment: ${commentId}`);
      console.error(error);
    }
  };

  const fetchPostComments = async () => {
    try {
      const commentsData = await fetchComments(_id);
      setComments(commentsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [_id]);

  return (
    <Card className="post">
      <PostHeader post={post} />
      <PostMedia media={thumbnail} />
      <PostActions postId={_id} handleDialogOpen={handleDialogOpen} deleteComment={deleteComment} />
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
      <PostDialog open={dialogOpen} handleClose={handleDialogClose} post={post} postId={_id} comments={comments} deleteComment={deleteComment} />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
          <CommentList 
            postId={_id} 
            comments={comments} 
            deleteComment={deleteComment} 
            fetchPostComments={fetchPostComments} 
          />
        </List>
      </Collapse>
    </Card>
  );
}

export default Post;
