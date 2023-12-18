import { CardActions, Button, TextField } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toggleLike } from "../../services/api.likes";
import timeSincePost from "../../services/timeUtils";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AuthContext } from "../Auth/AuthContext";
import { apiEditComment } from "../../services/api.comments";

function CommentActions({
  commentId,
  deleteComment,
  commentAuthorId,
  content,
  postId,
  created,
  likes: initialLikes,
  liked: initialLiked,
  editComment,
}) {
  const { user } = useContext(AuthContext);
  // const [commentContent, setCommentContent] = useState(content);
  const [editedComment, setEditedComment] = useState(content);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);

  const timeSince = timeSincePost(new Date(created));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditChange = (event) => {
    setEditedComment(event.target.value);
  };

  const handleSaveEdit = async () => {
    try {
      await apiEditComment(postId, commentId, editedComment);
      editComment(commentId, editedComment); // Update parent state
    } catch (error) {
      console.error(`Failed to edit comment: ${commentId}`, error);
    }
    handleEditClose();
  };

  const handleLike = async () => {
    // Optimistically update UI
    const newLikedStatus = !liked;
    const newLikesCount = liked ? likes - 1 : likes + 1;

    setLikes(newLikesCount);
    setLiked(newLikedStatus);

    try {
      const response = await toggleLike(
        commentId,
        newLikedStatus,
        user._id,
        false
      );
      // Update state based on API response
      setLikes(response.likeCount);
      setLiked(newLikedStatus); // Assuming the API toggles the like status
    } catch (error) {
      // Revert to initial state in case of error
      setLikes(initialLikes);
      setLiked(initialLiked);
      console.error("Could not update like status:", error);
    }
  };

  useEffect(() => {}, [user]);

  const userId = user.id || user._id;

  const showActions =
    user &&
    userId &&
    commentAuthorId &&
    userId.toString() === commentAuthorId.toString();

  useEffect(() => {
    if (editDialogOpen) {
      setEditedComment(content);
    }
  }, [editDialogOpen, content]);

  return (
    <CardActions>
      <IconButton onClick={handleLike}>
        {liked ? (
          <FavoriteIcon style={{ color: "red" }} />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
      {likes > 0 && <span>{likes} likes</span>}
      <span
        style={{
          color: "var(--secondary-color)",
          cursor: "default",
          marginLeft: "16px",
        }}
      >
        {timeSince}
      </span>
      <span
        style={{
          color: "var(--secondary-color)",
          cursor: "pointer",
          marginLeft: "16px",
        }}
      >
        Reply
      </span>
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
            <MenuItem onClick={() => deleteComment(commentId, user._id)}>
              Delete
            </MenuItem>
          </Menu>
          <Dialog open={editDialogOpen} onClose={handleEditClose}>
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
