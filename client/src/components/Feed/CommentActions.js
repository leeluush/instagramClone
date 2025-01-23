import React, { useContext, useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AuthContext } from "../Auth/AuthContext";
import { toggleLike } from "../../api/likesApi";
import { editComment as editCommentApi } from "../../api/commentApi";
import timeSincePost from "../../utils/timeSincePost";

function CommentActions({
  commentId,
  deleteComment,
  commentAuthorId,
  content,
  postId,
  created,
  likes: initialLikes,
  liked: initialIsLiked,
  updateComment,
}) {
  const { user } = useContext(AuthContext);
  const [editedComment, setEditedComment] = useState(content);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLikes, setCurrentLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  useEffect(() => {
    setCurrentLikes(initialLikes);
    setIsLiked(initialIsLiked);
  }, [initialLikes, initialIsLiked]);

  const timeSince = timeSincePost(new Date(created));

  const handleLike = async () => {
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
      setCurrentLikes(response.likeCount);
    } catch (error) {
      setCurrentLikes(initialLikes);
      setIsLiked(initialIsLiked);
      console.error("Could not update like status:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      await editCommentApi(postId, commentId, editedComment);
      updateComment(commentId, editedComment);
      setEditDialogOpen(false);
    } catch (error) {
      console.error(`Failed to edit comment: ${commentId}`, error);
    }
  };

  const userId = user.id || user._id;
  const showActions =
    user && userId?.toString() === commentAuthorId?.toString();

  return (
    <div className="comment-actions-container">
      <div className="comment-meta">
        <span className="comment-time">{timeSince}</span>
        {currentLikes > 0 && (
          <span className="comment-likes">{currentLikes} likes</span>
        )}
        <button className="comment-reply">Reply</button>
      </div>

      <div className="comment-buttons">
        <IconButton
          onClick={handleLike}
          className={`like-button ${isLiked ? "liked" : ""}`}
          size="small"
        >
          {isLiked ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>

        {showActions && (
          <>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              className="more-button"
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ vertical: -25, horizontal: "right" }}
              PaperProps={{
                sx: {
                  boxShadow: "0 2px 16px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  width: "200px",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  setEditDialogOpen(true);
                  setAnchorEl(null);
                }}
                sx={{ fontSize: 14, minHeight: 40, justifyContent: "center" }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  deleteComment(commentId);
                  setAnchorEl(null);
                }}
                sx={{
                  fontSize: 14,
                  minHeight: 40,
                  justifyContent: "center",
                  color: "rgb(237, 73, 86)",
                }}
              >
                Delete
              </MenuItem>
            </Menu>

            <Dialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              PaperProps={{
                sx: {
                  borderRadius: "12px",
                  width: "400px",
                },
              }}
            >
              <DialogTitle
                sx={{
                  textAlign: "center",
                  borderBottom: "1px solid rgb(219, 219, 219)",
                  padding: "10px 24px",
                  fontSize: "16px",
                }}
              >
                Edit comment
              </DialogTitle>
              <DialogContent sx={{ padding: "16px" }}>
                <TextField
                  autoFocus
                  fullWidth
                  multiline
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  variant="standard"
                  InputProps={{
                    sx: {
                      fontSize: 14,
                      padding: "8px 0",
                    },
                  }}
                />
              </DialogContent>
              <DialogActions
                sx={{
                  padding: "8px",
                  borderTop: "1px solid rgb(219, 219, 219)",
                }}
              >
                <Button
                  onClick={() => setEditDialogOpen(false)}
                  sx={{
                    color: "rgb(38, 38, 38)",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSave}
                  sx={{
                    color: "#0095f6",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Done
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

export default CommentActions;
