import React, { useState, useEffect, useContext } from 'react';
import { 
  Dialog, 
  DialogContent,  
  TextField, 
  Button, 
  Box, 
  Grid, 
  Typography, 
  Avatar 
} from '@mui/material';

import PostMedia from './PostMedia';
import CommentList from '../Comment/CommentList';
import { usePostLikes } from '../../services/api.likes';
import { postComment, fetchComments } from '../../services/api.comments';
import { AuthContext } from '../Auth/AuthContext';
import timeSincePost from '../../services/timeUtils';
import PostActions from './PostActions';

const PostDialog = ({ open, handleClose, post, postId, comments, deleteComment }) => {
  const { thumbnail, content, created } = post;
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [postComments, setPostComments] = useState(comments);
  const { userName, profileImage } = post.author;
  const { likes } = usePostLikes(postId);

  const createdDate = new Date(created);
  const timeSince = timeSincePost(createdDate);

  useEffect(() => {
    setPostComments(comments);
  }, [comments]);

  const fetchAndUpdateComments = async () => {
    const updatedComments = await fetchComments(postId);
    setPostComments(updatedComments);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!post || !user) {
      return;
    }

    try {
      await postComment(postId, comment, user._id);
      setComment('');
      const updatedComments = await fetchComments(postId);
      setPostComments(updatedComments);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" maxWidth="md" fullWidth>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <PostMedia media={thumbnail} />
          </Grid>
          <Grid item xs={6} style={{ paddingLeft: '16px' }}>
            <Box display="flex" alignItems="flex-start" mb={2}>
              <Avatar alt={userName} src={profileImage} sx={{ width: 32, height: 32, marginRight: 1 }} />
              <Typography variant="body1">
                <strong>{userName}</strong> {content}
              </Typography>
            </Box>
            <Typography variant="body2" style={{ paddingLeft: '40px', textDecoration: 'none' }}>
              {timeSince}
            </Typography>
            <Box sx={{ overflowY: 'scroll', maxHeight: '200px', marginBottom: '10px' }}>
              <CommentList postId={postId} comments={postComments} deleteComment={deleteComment} fetchPostComments={fetchAndUpdateComments} />
            </Box>
            <Box>
              <PostActions postId={postId} likes={likes} fetchAndUpdateComments={fetchAndUpdateComments} />
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
