import { CardActions, Typography , Button} from "@mui/material";
import { useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCommentLikes } from '../services/api.likes';
import timeSincePost from '../services/timeUtils';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { deleteComment } from '../services/api.comments';
import fetchComments from '../services/api.comments';

function CommentInteractions({ commentId, commentCreated, fetchComments }) {
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

    async function handleDeleteComment() {
        try {
          await deleteComment(commentId);
          handleClose(); // Close the dialog
          fetchComments(); // Refresh comments
        } catch (error) {
          console.error(error);
          // Here you could set an error message state to display to the user
        }
    }


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
                    <Typography>Are you sure you want to edit or delete your comment?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleDeleteComment}>Delete Comment</Button>
                </DialogActions>
            </Dialog>
        </CardActions>
    );
            }


export default CommentInteractions;
