const API_SERVER_URL = 'http://localhost:4000';


export async function fetchComments(postId) {
    try {
      const response = await fetch(`${API_SERVER_URL}/api/posts/${postId}/comments`, {
        credentials: 'include',
      });
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch comments');
    }
  }
  
  export async function postComment(postId, comment ) {
    try {
        const response = await fetch(`${API_SERVER_URL}/api/comments`, {
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








