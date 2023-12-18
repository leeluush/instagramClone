import React, { useState, useEffect, useContext } from "react";
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
import CommentList from "../Comment/CommentList";
import { postComment } from "../../services/api.comments";
import { AuthContext } from "../Auth/AuthContext";
import timeSincePost from "../../services/timeUtils";
import PostActions from "./PostActions";

const PostDialog = ({
  handleDialogOpen,
  dialogOpen,
  handleClose,
  post,
  postId,
  deleteComment,
  likeCount,
  isLiked,
  updateLikeCount,
  fetchAndUpdateComments,
  comments,
}) => {
  const { media, content, created } = post;
  const { user } = useContext(AuthContext);
  const { userName, profileImage } = post.author;
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [latestComment, setLatestComment] = useState(null);

  const createdDate = new Date(created);
  const timeSince = timeSincePost(createdDate);

  useEffect(() => {
    if (dialogOpen) {
      fetchAndUpdateComments(postId);
    }
  }, [dialogOpen, fetchAndUpdateComments, postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!post || !user) {
      return;
    }
    try {
      const response = await postComment(postId, comment, user._id);
      const newComment = response.data; // Access the new comment object from response.data

      setLocalComments([...localComments, newComment]);
      setLatestComment(newComment);
      fetchAndUpdateComments(postId); // Optionally, if additional updates are needed
      setComment("");
    } catch (error) {
      console.error(error);
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
              <Avatar
                alt={userName}
                src={profileImage}
                sx={{ width: 32, height: 32, marginRight: 1 }}
              />
              <Typography variant="body1">
                <strong>{userName}</strong> {content}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              style={{ paddingLeft: "40px", textDecoration: "none" }}
            >
              {timeSince}
            </Typography>
            <Box
              sx={{
                overflowY: "scroll",
                maxHeight: "200px",
                marginBottom: "10px",
              }}
            >
              <CommentList
                postId={postId}
                deleteComment={deleteComment}
                fetchAndUpdateComments={fetchAndUpdateComments}
                latestComment={latestComment}
                comments={comments}
              />
            </Box>
            <Box>
              <PostActions
                isLiked={isLiked}
                postId={postId}
                likes={likeCount}
                dialogOpen={dialogOpen}
                handleDialogOpen={handleDialogOpen}
                fetchAndUpdateComments={fetchAndUpdateComments}
                likeCount={likeCount}
                updateLikeCount={updateLikeCount}
              />
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
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
