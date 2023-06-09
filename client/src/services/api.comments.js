import { refreshToken } from "./api.service";

async function fetchWithTokenRefresh(input, init) {
  const response = await fetch(input, { ...init, credentials: 'include' });

  if (response.status === 401) {
    const refreshedResponse = await refreshToken();

    if (!refreshedResponse.ok) {
      throw new Error('Failed to refresh token');
    }

    // Retry the request
    return await fetch(input, { ...init, credentials: 'include' });
  }

  return response;
}

export async function apiDeleteComment(commentId, userId) {

  try {
    const response = await fetchWithTokenRefresh(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete comment')
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete comment', error);
  }
}

export async function fetchComments(postId) {
 
  try {
    const response = await fetchWithTokenRefresh(`/api/posts/${postId}/comments`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const comments = await response.json();
    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function apiEditComment(commentId, commentContent) {
 
  try {
    const response = await fetchWithTokenRefresh(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment: commentContent })
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was an error updating the comment', error)
  }
}
export async function postComment(postId, comment) {
  try {
    const response = await fetchWithTokenRefresh(`/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: postId, content: comment }),
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
