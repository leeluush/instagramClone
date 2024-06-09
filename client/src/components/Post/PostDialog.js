import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Grid,
  Typography,
  Avatar,
} from "@mui/material";
import PostMedia from "./PostMedia";
import CommentList from "../Feed/CommentList";
import CommentInput from "../Shared/CommentInput";
import { AuthContext } from "../Auth/AuthContext";
import timeSincePost from "../../utils/timeSincePost";
import PostActions from "./PostActions";
import { usePostLikes } from "../../hooks/usePostLikes";

const PostDialog = ({
  handleDialogOpen,
  dialogOpen,
  handleClose,
  post,
  postId,
  deleteComment,
  comments,
  updateComment,
  addComment,
}) => {
  const { media, content, created, likeCount, isLiked } = post;
  const { user } = useContext(AuthContext);
  const { userName, profileImage } = post.author;
  const { likes, liked, handleLike } = usePostLikes(postId, likeCount, isLiked);

  const handleCommentSubmit = (comment) => {
    if (user && postId) {
      addComment(postId, comment, user._id);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
      PaperProps={{
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
        },
      }}
    >
      <DialogContent style={{ display: 'flex', flexDirection: 'column', padding: 0, height: '100%', overflow: 'hidden' }}>
        <Grid container spacing={0} style={{ height: '100%' }}>
          <Grid item xs={6} style={{ overflow: 'hidden' }}>
            <PostMedia media={media} />
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box display="flex" alignItems="center" p={2} borderBottom="1px solid #e0e0e0">
              <Avatar alt={userName} src={profileImage} sx={{ width: 32, height: 32, marginRight: 1 }} />
              <Typography variant="body1"><strong>{userName}</strong></Typography>
            </Box>
            <Box display="flex" flexDirection="column" p={2} borderBottom="1px solid #e0e0e0">
              <Typography variant="body1">{content}</Typography>
              <Typography variant="body2" color="textSecondary">
                {timeSincePost(new Date(created))}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                width: '100%',
                padding: 2,
              }}
            >
              <CommentList
                postId={postId}
                deleteComment={deleteComment}
                comments={comments}
                updateComment={updateComment}
              />
            </Box>
            <Box p={2} pt={0}>
              <PostActions
                isLiked={liked}
                likeCount={likes}
                handleDialogOpen={handleDialogOpen}
                onLike={handleLike}
              />
              <CommentInput onCommentSubmit={handleCommentSubmit} />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
