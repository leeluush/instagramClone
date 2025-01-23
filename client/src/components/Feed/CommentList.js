import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import {
  deleteComment as apiDeleteComment,
  editComment as apiEditComment,
} from "../../api/commentApi";
import CommentActions from "./CommentActions";
import "./CommentList.css";

function CommentList({
  postId,
  userId,
  comments,
  deleteComment,
  updateComment,
  latestComment,
}) {
  const [localComments, setLocalComments] = useState(comments || []);

  useEffect(() => {
    if (latestComment) {
      setLocalComments((prevComments) => {
        const exists = prevComments.some(
          (comment) => comment._id === latestComment._id
        );
        if (!exists) {
          return [latestComment, ...prevComments];
        }
        return prevComments;
      });
    }
  }, [latestComment]);

  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  const handleDeleteComment = async (commentId) => {
    try {
      await apiDeleteComment(commentId, postId);
      setLocalComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      if (deleteComment) {
        deleteComment(commentId);
      }
    } catch (error) {
      console.error(`Failed to delete comment: ${commentId}`, error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await apiEditComment(postId, commentId, newContent);
      setLocalComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: newContent }
            : comment
        )
      );
      if (updateComment) {
        updateComment(commentId, newContent);
      }
    } catch (error) {
      console.error(`Failed to edit comment: ${commentId}`, error);
    }
  };

  return (
    <div className="instagram-comments">
      {localComments?.map((comment) => (
        <div key={comment._id} className="comment-row">
          <div className="comment-user-avatar">
            <Avatar
              src={comment.author?.profileImage}
              alt={comment.author?.userName}
            />
          </div>
          <div className="comment-main">
            <div className="comment-content">
              <span className="comment-username">
                {comment.author?.userName}
              </span>
              {comment.content}
            </div>
            <CommentActions
              commentId={comment._id}
              deleteComment={handleDeleteComment}
              userId={userId}
              commentAuthorId={comment.author?._id}
              updateComment={handleEditComment}
              content={comment.content}
              postId={postId}
              created={comment.created}
              likes={comment.likes}
              liked={comment.isLiked}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
