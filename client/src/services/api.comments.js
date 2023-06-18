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


  