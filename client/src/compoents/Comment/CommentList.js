import React from "react";
import { Grid, ListItem, ListItemAvatar, Avatar, Typography, Box } from "@mui/material";
import CommentActions from "./CommentActions";

function CommentList({ postId, comments, deleteComment, fetchPostComments, userId, editComment }) {

  return (
    <>
      {comments && comments.map((comment) => {
        const { content, _id , author} = comment;
        const userName = comment.author?.userName || '';
        const profileImage = comment.author?.profileImage || '';
        const commentAuthorId = author?._id || '';  // Obtain authorId from each comment


        return (
          <ListItem key={_id} alignItems="flex-start">
            <Grid container>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <ListItemAvatar>
                    <Avatar alt={userName} src={profileImage} sx={{ width: 32, height: 32 }} />
                  </ListItemAvatar>
                  <Box ml={0}>
                    <Typography component="span" variant="body1" color="textPrimary">
                      <strong>{userName}</strong>
                    </Typography>
                    <Typography component="span" variant="body2" color="textSecondary" ml={1}>
                      {content}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <CommentActions
                  commentId={_id}
                  deleteComment={deleteComment}
                  fetchPostComments={fetchPostComments}
                  userId={userId}
                  commentAuthorId={commentAuthorId}
                  editComment={editComment}
                  content={content}
                  postId={postId}
       
             
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
