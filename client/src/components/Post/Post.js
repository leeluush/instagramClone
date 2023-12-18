import React, { useState, useContext, useEffect } from "react";
import {
  Collapse,
  IconButton,
  Card,
  CardActions,
  List,
  Button,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostDialog from "./PostDialog";
import { AuthContext } from "../Auth/AuthContext";
import { postComment } from "../../services/api.comments";

import CommentList from "../Comment/CommentList";
import "./Post.css";

function Post({
  post,
  setPosts,
  handlePostDeletion,
  updateLikeCount,
  fetchAndUpdateComments,
  comments,
}) {
  const { media, _id, content } = post;
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    fetchAndUpdateComments(_id);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!post || !user) {
      return;
    }
    try {
      const response = await postComment(_id, comment, user._id);
      const newComment = response.data; // Access the new comment object from response.data

      setLocalComments((prevComments) => [...prevComments, newComment]);
      fetchAndUpdateComments(_id); // Optionally, if additional updates are needed
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="post">
      <PostHeader
        post={post}
        isFollowing={isFollowing}
        setIsFollowing={setIsFollowing}
        setPosts={setPosts}
        handlePostDeletion={handlePostDeletion}
      />
      <PostMedia media={media}></PostMedia>
      <PostContent content={content} />
      <PostActions
        postId={_id}
        likeCount={post.likeCount}
        isLiked={post.isLiked}
        handleDialogOpen={handleDialogOpen}
        updateLikeCount={updateLikeCount}
      ></PostActions>
      <CardActions disableSpacing>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <PostDialog
        dialogOpen={dialogOpen}
        handleDialogOpen={handleDialogOpen}
        handleClose={handleDialogClose}
        post={post}
        postId={_id}
        likeCount={post.likeCount}
        isLiked={post.isLiked}
        updateLikeCount={updateLikeCount}
        fetchAndUpdateComments={fetchAndUpdateComments}
        comments={comments}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
          <CommentList
            postId={_id}
            comments={localComments}
            fetchAndUpdateComments={fetchAndUpdateComments}
          />
        </List>
        <form onSubmit={handleSubmit}>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Post Comment
          </Button>
        </form>
      </Collapse>
    </Card>
  );
}

export default Post;
