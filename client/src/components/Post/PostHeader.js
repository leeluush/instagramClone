import React, { useContext } from "react";
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  Dialog,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AuthContext } from "../Auth/AuthContext";
import EditPost from "../CreatePost/EditPost";
import { deletePostApi } from "../../api/postsApi";
import useDialog from "../../hooks/useDialog";
import timeSincePost from "../../utils/timeSincePost";

import "./PostHeader.css";

function PostHeader({
  post,
  handleFollowToggle,
  fetchPosts,
  handlePostDeletion,
  isFollowing,
}) {
  const { user } = useContext(AuthContext);
  const optionsDialog = useDialog();
  const editDialog = useDialog();

  const handleDeletePost = async () => {
    try {
      await deletePostApi(post._id);
      handlePostDeletion(post._id);
      optionsDialog.closeDialog();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (!post || !post.author) return null;
  const { userName, profileImage } = post.author;
  const timeSince = timeSincePost(new Date(post.created));

  return (
    <div className="post-header">
      <div className="post-header-left">
        <Avatar
          src={profileImage}
          alt={userName}
          className="post-header-avatar"
        />
        <div className="post-header-info">
          <a href="#" className="post-header-username">
            {userName}
          </a>
          <span className="post-header-time">{timeSince}</span>
        </div>
      </div>

      <div className="post-header-actions">
        {user && user._id !== post.author._id && (
          <button
            className="post-header-button"
            onClick={() => handleFollowToggle(user._id, post.author._id)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        {user && user._id === post.author._id && (
          <IconButton
            onClick={optionsDialog.openDialog}
            sx={{
              padding: "8px",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </div>

      <Dialog
        onClose={optionsDialog.closeDialog}
        open={optionsDialog.isOpen}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "400px",
          },
        }}
      >
        <List sx={{ padding: 0 }}>
          <ListItemButton
            onClick={editDialog.openDialog}
            sx={{
              py: 1.5,
              borderBottom: "1px solid rgb(219, 219, 219)",
              justifyContent: "center",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <ListItemText
              primary="Edit Post"
              primaryTypographyProps={{
                sx: {
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: 400,
                },
              }}
            />
          </ListItemButton>
          <ListItemButton
            onClick={handleDeletePost}
            sx={{
              py: 1.5,
              justifyContent: "center",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            <ListItemText
              primary="Delete Post"
              primaryTypographyProps={{
                sx: {
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#ed4956",
                },
              }}
            />
          </ListItemButton>
        </List>
      </Dialog>

      <EditPost
        open={editDialog.isOpen}
        handleClose={editDialog.closeDialog}
        post={post}
        fetchPosts={fetchPosts}
      />
    </div>
  );
}

export default PostHeader;
