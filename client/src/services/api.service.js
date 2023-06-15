const API_SERVER_URL = 'http://localhost:4000';

export async function sendJson(body, method, url) {
  try {
    const response = await fetch(`${API_SERVER_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${response}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUsersById(userId) {
  try {
    const response = await fetch(`${API_SERVER_URL}/users/${userId}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPosts() {
  try {
    const response = await fetch(`${API_SERVER_URL}/api/posts`, {
      credentials: 'include',
    });

    if (!response.ok) {
        console.log('Response:', response);
        throw new Error('Failed to fetch posts');
      }
  

    const posts = await response.json();

    return posts;
  } catch (error) {
    console.error(error);
    console.error('Error fetching posts:', error);

    throw error
  }
}

export async function fetchComments() {
  try {
    const response = await fetch(`${API_SERVER_URL}/api/comments/`, {
      credentials: 'include',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch comments');
  }
}

export async function followUser(userId, followerId) {
  try {
    const response = await fetch(`${API_SERVER_URL}/api/users/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, followerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to follow user');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function unfollowUser(userId, followerId) {
  try {
    const response = await fetch(`${API_SERVER_URL}/api/users/unfollow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, followerId }),
    });
    if (!response.ok) {
      throw new Error('Failed to unfollow user');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await fetch(`${API_SERVER_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      // Handle successful logout if needed
    } else {
      throw new Error('Logout failed');
    }
    return response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function fetchUserInfo() {
  try {
    const response = await fetch(`${API_SERVER_URL}/api/users/userprofile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('401');
    } else if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
}
