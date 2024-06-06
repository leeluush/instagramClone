import React, { useContext } from "react";
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";
import timeSincePost from "../../utils/timeSincePost";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AuthContext } from "../Auth/AuthContext";
import EditPost from "../CreatePost/EditPost";
import { deletePostApi } from "../../api/postsApi";
import useDialog from "../../hooks/useDialog";

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
  const { created } = post;
  const createdDate = new Date(created);
  const timeSince = timeSincePost(createdDate);

  return (
    <Box mb={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border:'none'}}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Avatar
          alt={userName}
          src={profileImage}
          sx={{ width: 32, height: 32 , marginTop: 1}}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '10px'}}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#262626', fontSize: '14px' ,marginLeft:'1px'}}>
            {userName}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            {'· ' + timeSince}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {user && user._id !== post.author._id && (
          <Button
            onClick={() => handleFollowToggle(user._id, post.author._id)}
            variant="contained"
            size="small"
            sx={{width: '95px', marginTop: '10px', fontSize: '12px'}}
            
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
        {user && user._id === post.author._id && (
          <IconButton
            sx={{ '&:hover': { bgcolor: 'lightgrey' } }}
            onClick={optionsDialog.openDialog}
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </Box>
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
  );
}

export default PostHeader;