export async function deleteComment(commentId) {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();
    

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete comment');
  }
}

export async function fetchComments(postId) {
  try {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      credentials: 'include',
    });

    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error('Server responded with an error');
    }

    const data = await response.json();


    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch comments');
  }
}

  
  export async function postComment(postId, comment ) {
    try {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: postId, content: comment  }),
            credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to post comment');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }








