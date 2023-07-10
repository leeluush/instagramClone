import { CardActions, Typography, Button, TextField } from "@mui/material";
import { useContext, useState, useEffect } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCommentLikes } from '../../services/api.likes';
import timeSincePost from '../../services/timeUtils';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AuthContext } from "../Auth/AuthContext";
import { apiEditComment, fetchComments } from "../../services/api.comments";

function CommentActions({ commentId, deleteComment, commentAuthorId, content, postId,fetchPostComments}) {
  const { user } = useContext(AuthContext)
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { likes, liked, handleLike } = useCommentLikes(commentId);
  const [anchorEl, setAnchorEl] = useState(null);

  const timeSince = timeSincePost(new Date());

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    setEditMode(true);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditMode(false);
    setEditDialogOpen(false);
  };

  const handleEditChange = (event) => {
    setEditedComment(event.target.value);
  }

  const handleSaveEdit = async () => {
    try {
      await apiEditComment(commentId, editedComment);
      await fetchPostComments(postId)

      handleEditClose();
    } catch (error) {
      console.error(`Failed to edit comment: ${commentId}`, error);
    }
  }

  const showActions = user && user._id && commentAuthorId && user._id.toString() === commentAuthorId.toString();

  useEffect(() => {
    if (editDialogOpen) {
      setEditedComment(content);
    }
  }, [editDialogOpen, content]);

  return (
    <CardActions>
      <IconButton onClick={handleLike}>
        {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
      </IconButton>
      {likes > 0 && <span>{likes} likes</span>}
      <Typography variant="body2" color="primary" style={{ cursor: 'pointer', marginLeft: '16px' }}>
        {timeSince}
      </Typography>
      <Typography variant="body2" color="primary" style={{ cursor: 'pointer', marginLeft: '16px' }}>
        Reply
      </Typography>
      {showActions && (
        <>
          <IconButton onClick={handleMenuClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
            <MenuItem onClick={() => deleteComment(commentId, user._id)}>Delete</MenuItem>
          </Menu>
          <Dialog
            open={editDialogOpen}
            onClose={handleEditClose}
          >
            <DialogTitle>Edit your comment</DialogTitle>
            <DialogContent>
              <TextField 
                autoFocus
                margin="dense"
                label="Edit Comment" 
                type="text"
                fullWidth
                value={editedComment}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditClose}>Close</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </CardActions>
  );
}

export default CommentActions;
