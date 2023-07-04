import { CardActions, Typography, Button } from "@mui/material";
import { useContext, useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCommentLikes } from '../../services/api.likes';
import timeSincePost from '../../services/timeUtils';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AuthContext } from "../Auth/AuthContext";

function CommentActions({ commentId, deleteComment, commentAuthorId }) {
  const { user } = useContext(AuthContext)


  const { likes, liked, handleLike } = useCommentLikes(commentId);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  var aDay = 24 * 60 * 60 * 1000;
  const timeSince = timeSincePost(new Date(Date.now() - aDay));

  const handleOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const showActions = user && user._id && commentAuthorId && user._id.toString() === commentAuthorId.toString();


  return (
    <CardActions>
      {liked ? (
        <FavoriteIcon onClick={handleLike} style={{ color: 'red' }} />
      ) : (
        <FavoriteBorderIcon onClick={handleLike} />
      )}
      {likes > 0 && (
        <span>{likes} likes</span>
      )}
      <Typography variant="body2" color="primary" style={{ cursor: 'pointer', marginLeft: '16px' }}>
        {timeSince}
      </Typography>
      <Typography variant="body2" color="primary" style={{ cursor: 'pointer', marginLeft: '16px' }}>
        Reply
      </Typography>
      {showActions && (
      <>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOpen}>Edit</MenuItem>
        <MenuItem onClick={handleOpen}>Delete</MenuItem>
      </Menu>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Edit or delete your comment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your comment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => deleteComment(commentId, user._id)}>Delete Comment</Button>
        </DialogActions>      
    </Dialog>
     </>
    )}
    </CardActions >
  );
}

export default CommentActions;
