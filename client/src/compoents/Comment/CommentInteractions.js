import { CardActions, Typography, Button } from "@mui/material";
import { useState, useEffect } from 'react'; // Import useEffect hook
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCommentLikes } from '../../services/api.likes';
import timeSincePost from '../../services/timeUtils';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { deleteComment } from '../../services/api.comments';


function CommentInteractions({ commentId }) {
    const { likes, liked, handleLike } = useCommentLikes(commentId);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleted, setDeleted] = useState(false); // Track deleted state

    var aDay = 24 * 60 * 60 * 1000;
    const timeSince = timeSincePost(new Date(Date.now() - aDay));

    useEffect(() => {
        // Check if comment has been deleted and close the dialog
        if (deleted) {
            setOpen(false);
        }
    }, [deleted]);

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

            console.log(`Deleted comment: ${commentId}`);
            setDeleted(true); // Set deleted state to trigger re-render

        } catch (error) {
            console.error(`Error deleting comment: ${commentId}`);
            console.error(error);
        }
    }

    // Render null if comment is deleted
    if (deleted) {
        return null;
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
