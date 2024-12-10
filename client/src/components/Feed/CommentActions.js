import { CardActions, Button, TextField } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toggleLike } from "../../api/likesApi";
import timeSincePost from "../../utils/timeSincePost";
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
import { editComment as editCommentApi } from "../../api/commentApi";

function CommentActions({
  commentId,
  deleteComment,
  commentAuthorId,
  content,
  postId,
  created,
  likes: initialLikes,
  liked: initialIsLiked,
  updateComment, // This is passed from the parent component (CommentList)
}) {
  const { user } = useContext(AuthContext);
  const [editedComment, setEditedComment] = useState(content);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLikes, setCurrentLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  useEffect(() => {
    console.log("Initial Likes:", initialLikes);
    console.log("Initial IsLiked:", initialIsLiked);
    setCurrentLikes(initialLikes);
    setIsLiked(initialIsLiked);
  }, [initialLikes, initialIsLiked]);

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
      const updatedCommentData = await editCommentApi(
        postId,
        commentId,
        editedComment
      );
      if (updatedCommentData) {
        updateComment(commentId, editedComment);
      }
      handleEditClose();
    } catch (error) {
      console.error(`Failed to edit comment: ${commentId}`, error);
    }
  };

  const handleLike = async () => {
    // Optimistically update UI
    const newLikedStatus = !isLiked;
    const newLikesCount = isLiked ? currentLikes - 1 : currentLikes + 1;

    setCurrentLikes(newLikesCount);
    setIsLiked(newLikedStatus);

    try {
      const response = await toggleLike(
        commentId,
        newLikedStatus,
        user._id,
        false
      );

      // Assuming response contains the updated like count
      setCurrentLikes(response.likeCount);
      setIsLiked(newLikedStatus); // Assuming the API toggles the like status
    } catch (error) {
      // Revert to initial state in case of error
      setCurrentLikes(initialLikes);
      setIsLiked(initialIsLiked);
      console.error("Could not update like status:", error);
    }
  };

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
        {isLiked ? (
          <FavoriteIcon style={{ color: "red" }} />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
      {currentLikes !== undefined ? (
        <span>{currentLikes} likes</span>
      ) : (
        <span>Loading likes...</span>
      )}
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
