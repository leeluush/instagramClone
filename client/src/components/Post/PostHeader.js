import React, { useState, useContext } from "react";
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  ListItemButton,
  Button,
} from "@mui/material";
import timeSincePost from "../../utils/timeSincePost";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Dialog, List, ListItemText } from "@mui/material";
import { AuthContext } from "../Auth/AuthContext";
import EditPost from "../CreatePost/EditPost";
import { deletePostApi } from "../../api/postsApi";
import { followUserApi, unfollowUserApi } from "../../api/userFollowApi";
import "./PostHeader.css";

function PostHeader({
  post,
  isFollowing,
  setIsFollowing,
  fetchPosts,
  handlePostDeletion,
}) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleFollow = async () => {
    try {
      await followUserApi(post.author._id);
      console.log(post.author._id);
      setIsFollowing(true);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUserApi(post.author._id);
      setIsFollowing(false);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeletePost = async () => {
    try {
      await deletePostApi(post._id);
      handlePostDeletion(post._id);
      handleClose();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleEditOpen = () => {
    setOpen(false);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  if (!post || !post.author) return null;
  const { userName, profileImage } = post.author;
  const { created } = post;
  const createdDate = new Date(created);
  const timeSince = timeSincePost(createdDate);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className="post-header"
      mb={2}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          alt={userName}
          src={profileImage}
          sx={{ width: 32, height: 32 }}
          className="post-header-avatar"
        />
       <Box display="flex" alignItems="center" className="post-header-username-timestamp">
          <Typography className="post-header-username" variant="body1" component="span" fontWeight="bold">
            {userName}
          </Typography>
          <Typography variant="body2" component="span" color="textSecondary">
            {" • "}
          </Typography>
          <Typography className="post-header-timestamp" variant="body2" component="span" color="textSecondary">
            {timeSince}
            <Typography variant="body2" component="span" color="textSecondary">
            {" • "}
          </Typography>
          </Typography>
        </Box>
      </Box>
      <Box className="post-header-options">
      {user && user._id !== post.author._id && (
        <Box>
          <Button onClick={isFollowing ? handleUnfollow : handleFollow}>
            {isFollowing ? "unfollow" : "follow"}
          </Button>
        </Box>
      )}
      {user && user._id === post.author._id && (
        <Box>
          <IconButton onClick={handleClickOpen}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
      )}
      <Dialog onClose={handleClose} open={open}>
        <List>
          <ListItemButton onClick={handleEditOpen}>
            <ListItemText primary="Edit Post" />
          </ListItemButton>
          <ListItemButton onClick={handleDeletePost}>
            <ListItemText primary="Delete Post" />
          </ListItemButton>
        </List>
      </Dialog>
      <EditPost
        open={editOpen}
        handleClose={handleEditClose}
        post={post}
        fetchPosts={fetchPosts}
        />
        </Box>
    </Box>
  );
}

export default PostHeader;
