import React, { useState, useContext } from "react";
import { Card, Typography } from "@mui/material";
import PostHeader from "../Post/PostHeader";
import PostMedia from "../Post/PostMedia";
import PostContent from "../Post/PostContent";
import PostActions from "../Post/PostActions";
import PostDialog from "../Post/PostDialog";
import useFollowToggle from "../../hooks/useFollowToggle";
import useComments from "../../hooks/useComments";
import { AuthContext } from "../Auth/AuthContext";
import { usePostLikes } from "../../hooks/usePostLikes";
import CommentInput from "../Shared/CommentInput";

import "./Post.css";

function Post({ post, handlePostDeletion }) {
  const { comments, addComment, updateComment, removeComment } = useComments(post.comments);
  const { media, _id, author } = post;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { likes, liked, handleLike } = usePostLikes(_id, post.likeCount, post.isLiked);
  const { followedUsers, handleFollowToggle } = useFollowToggle({ [post.author._id]: post.isFollowing });

  return (
    <Card className="post" style={{ border: "none", boxShadow: "none" }}>
      <PostHeader
        post={post}
        handleFollowToggle={() => handleFollowToggle(user._id, post.author._id)}
        handlePostDeletion={handlePostDeletion}
        isFollowing={followedUsers[post.author._id]}
      />
      <PostMedia media={media} />
      <PostActions
        postId={_id}
        likeCount={likes}
        isLiked={liked}
        handleDialogOpen={() => setDialogOpen(true)}
        onLike={handleLike}
      />
      <PostContent content={post.content} author={author} />
      <Typography
        variant="body2"
        color="textSecondary"
        className="view-comments"
        onClick={() => setDialogOpen(true)}
        style={{ cursor: "pointer", marginTop: "5px", marginBottom: "5px" }}
      >
        View all {comments.length} comments
      </Typography>
      {comments.length > 0 && (
        <div className="first-comment">
          <strong>{comments[0].author.userName}: </strong>
          {comments[0].content}
        </div>
      )}
      <PostDialog
        dialogOpen={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        post={post}
        postId={post._id}
        comments={comments}
        deleteComment={removeComment}
        updateComment={updateComment}
        addComment={addComment}  
      />
      <CommentInput onCommentSubmit={(comment) => addComment(post._id, comment, user._id)} />
    </Card>
  );
}

export default Post;
