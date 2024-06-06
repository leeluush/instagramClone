import React, { useState, useEffect } from "react";
import { deleteComment as apiDeleteComment, editComment as apiEditComment } from "../../api/commentApi";

import {
  Grid,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import CommentActions from "./CommentActions";

function CommentList({
  postId,
  userId,
  latestComment,
  comments,
}) {
  const [localComments, setLocalComments] = useState(comments || []);

  useEffect(() => {
    console.log(comments); // Debug statement to check incoming comments
  }, [comments]);

  useEffect(() => {
    if (latestComment) {
      setLocalComments((prevComments) => [latestComment, ...prevComments]);
    }
  }, [latestComment]);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleDeleteComment = async (commentId) => {
    try {
      await apiDeleteComment(commentId, postId);
      setLocalComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error(`Failed to delete comment: ${commentId}`, error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await apiEditComment(postId, commentId, newContent);
      setLocalComments((prevComments) => 
        prevComments.map((comment) => 
          comment._id === commentId ? { ...comment, content: newContent } : comment
        )
      );
    } catch (error) {
      console.error(`Failed to edit comment: ${commentId}`, error);
    }
  };

  return (
    <>
      {localComments &&
        localComments.map((comment) => {
          const { content, _id, author } = comment;
          const userName = author?.userName || "";
          const profileImage = author?.profileImage || "";

          return (
            <ListItem key={_id} alignItems="flex-start">
              <Grid container>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <ListItemAvatar>
                      <Avatar
                        alt={userName}
                        src={profileImage}
                        sx={{ width: 32, height: 32 }}
                      />
                    </ListItemAvatar>
                    <Box ml={0}>
                      <Typography
                        component="span"
                        variant="body1"
                        color="textPrimary"
                      >
                        <strong>{userName}</strong> {content}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <CommentActions
                    commentId={_id}
                    deleteComment={handleDeleteComment}
                    userId={userId}
                    commentAuthorId={author?._id}
                    updateComment={handleEditComment}
                    content={content}
                    postId={postId}
                    created={comment.created}
                    likes={comment.likes}
                    liked={comment.isLiked}
                    likesCount={comment.likesCount}
                  />
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
    </>
  );
}

export default CommentList;
