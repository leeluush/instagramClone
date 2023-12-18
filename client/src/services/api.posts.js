import { refreshToken } from './api.service';

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

async function createPostApi(postData) {
  const response = await fetchWithTokenRefresh('/api/posts', {
    method: 'POST',
    body: postData,
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
}

async function deletePostApi(postId) {
  const response = await fetchWithTokenRefresh(`/api/posts/${postId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
  return response.json();
}

async function editPostApi(formData, postId, user) {
  const response = await fetchWithTokenRefresh(`/api/posts/${postId}`, {
    method: 'PATCH',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to edit the post');
  }
  return response.json();
}

export { createPostApi, deletePostApi, editPostApi };
