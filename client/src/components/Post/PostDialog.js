import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Avatar,
} from "@mui/material";

import PostMedia from "./PostMedia";
import CommentList from "../Feed/CommentList";
import { postComment } from "../../api/commentApi";
import { AuthContext } from "../Auth/AuthContext";
import timeSincePost from "../../utils/timeSincePost";
import PostActions from "./PostActions";
import { usePostLikes } from "../../hooks/usePostLikes"; // Ensure you import the usePostLikes hook

const PostDialog = ({
  handleDialogOpen,
  dialogOpen,
  handleClose,
  post,
  postId,
  deleteComment,
  comments,
  updateComment,
}) => {
  const { media, content, created, likeCount, isLiked } = post;
  const { user } = useContext(AuthContext);
  const { userName, profileImage } = post.author;
  const [comment, setComment] = useState("");

  // Using the usePostLikes hook
  const { likes, liked, handleLike } = usePostLikes(postId, likeCount, isLiked);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!post || !user) return;
    try {
      const response = await postComment(postId, comment, user._id);
      setComment(""); // Clear comment field
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      scroll="paper"
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <PostMedia media={media} />
          </Grid>
          <Grid item xs={6} style={{ paddingLeft: "16px" }}>
            <Box display="flex" alignItems="flex-start" mb={2}>
              <Avatar alt={userName} src={profileImage} sx={{ width: 32, height: 32, marginRight: 1 }} />
              <Typography variant="body1"><strong>{userName}</strong> {content}</Typography>
            </Box>
            <Typography variant="body2" style={{ paddingLeft: "40px", textDecoration: "none" }}>
              {timeSincePost(new Date(created))}
            </Typography>
            <CommentList
              postId={postId}
              deleteComment={deleteComment}
              comments={comments}
              updateComment={updateComment}
            />
            <PostActions
              isLiked={liked}
              likeCount={likes}
              handleDialogOpen={handleDialogOpen}
              onLike={handleLike}
            />
            <form onSubmit={handleSubmit}>
              <TextField
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
              <Button type="submit" variant="contained" color="primary">
                Post Comment
              </Button>
            </form>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
