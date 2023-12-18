import React, { useState, useEffect } from "react";

import { apiDeleteComment, apiEditComment } from "../../services/api.comments";

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
  fetchAndUpdateComments,
  userId,
  latestComment,
  comments,
}) {
  const [localComments, setLocalComments] = useState(comments || []);

  useEffect(() => {
    if (latestComment) {
      setLocalComments((prevComments) => [latestComment, ...prevComments]);
    }
  }, [latestComment]);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const deleteComment = async (commentId) => {
    try {
      await apiDeleteComment(commentId, postId);
      fetchAndUpdateComments(postId);
    } catch (error) {
      console.error(`Failed to delete comment: ${commentId}`);
      console.error(error);
    }
  };

  const editComment = async (commentId, newComment) => {
    try {
      await apiEditComment(commentId, newComment);
      fetchAndUpdateComments(postId);
    } catch (error) {
      console.error(`Failed to edit comment: ${commentId}`);
      console.error(error);
    }
  };

  return (
    <>
      {localComments &&
        localComments.map((comment) => {
          const { content, _id, author } = comment;

          const userName = comment.author?.userName || "";
          const profileImage = comment.author?.profileImage || "";
          const commentAuthorId = author?._id || "";

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
                        <strong>{userName}</strong>
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        ml={1}
                      >
                        {content}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <CommentActions
                    commentId={comment._id}
                    deleteComment={deleteComment}
                    userId={userId}
                    commentAuthorId={commentAuthorId}
                    editComment={editComment}
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
