import React, {  useContext } from "react";
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  ListItemButton,
  Button,
  Dialog,
  List,
  ListItemText
} from "@mui/material";
import timeSincePost from "../../utils/timeSincePost";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AuthContext } from "../Auth/AuthContext";
import EditPost from "../CreatePost/EditPost";
import { deletePostApi } from "../../api/postsApi";
import useDialog from "../../hooks/useDialog";

import "./PostHeader.css";

function PostHeader({
  post,
  handleFollowToggle, 
  fetchPosts,
  handlePostDeletion,
  followedUsers,
}) {

  const { user } = useContext(AuthContext);
  const optionsDialog = useDialog();
  const editDialog = useDialog();


  const handleDeletePost = async () => {
    try {
      await deletePostApi(post._id);
      handlePostDeletion(post._id);
      optionsDialog.closeDialog()
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
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
          <Button onClick={() => handleFollowToggle(user._id, post.author._id)}>
            {followedUsers[post.author._id] ? "Unfollow" : "Follow"}
          </Button>
        )}

        {user && user._id === post.author._id && (
          <IconButton onClick={optionsDialog.openDialog}>
            <MoreHorizIcon />
          </IconButton>
        )}

        <Dialog onClose={optionsDialog.closeDialog} open={optionsDialog.isOpen}>
          <List>
            <ListItemButton onClick={editDialog.openDialog}>
              <ListItemText primary="Edit Post" />
            </ListItemButton>
            <ListItemButton onClick={handleDeletePost}>
              <ListItemText primary="Delete Post" />
            </ListItemButton>
          </List>
        </Dialog>

        <EditPost
          open={editDialog.isOpen}
          handleClose={editDialog.closeDialog}
          post={post}
          fetchPosts={fetchPosts}
        />
      </Box>
    </Box>
  );
}


export default PostHeader;
