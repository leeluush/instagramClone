import { useState, useCallback } from 'react';
import { postComment, editComment, deleteComment } from '../api/commentApi';

function useComments(initialComments) {
  const [comments, setComments] = useState(initialComments);

  const addComment = useCallback(async (postId, content, userId) => {
    try {
      const response = await postComment(postId, content, userId);
      const newComment = response.data;
      setComments(prevComments => [...prevComments, newComment]);  
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, []);

  const updateComment = useCallback(async (commentId, content) => {
    try {
      await editComment(commentId, content);
      setComments(prevComments => prevComments.map(comment => 
        comment._id === commentId ? { ...comment, content } : comment
      ));
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  }, []);

  const removeComment = useCallback(async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }, []);

  return { comments, addComment, updateComment, removeComment };
}

export default useComments;
