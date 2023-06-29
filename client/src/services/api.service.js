

export async function sendJson(body, method, url) {
  try {
    const response = await fetch(`${url}`, {
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
    const response = await fetch(`/users/${userId}`, {
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
    const response = await fetch(`/api/posts`, {
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





export async function followUser(userId, followerId) {
  try {
    const response = await fetch(`/api/users/follow`, {
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
    const response = await fetch(`/api/users/unfollow`, {
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
    const response = await fetch(`/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
 
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
    const response = await fetch(`/api/users/userprofile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      const refreshedResponse = await refreshToken();

      if (!refreshedResponse.ok) {
        throw new Error('Failed to refresh token');
      }
      
      return fetchUserInfo();
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

  export async function refreshToken() {
    try {
      const response = await fetch(`/api/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      return response;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

