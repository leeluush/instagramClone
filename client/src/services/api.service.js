export function getToken() {
    return localStorage.getItem('token');
  }


export async function sendJson(body, method, url) {
    const token = getToken();

    try {
        const response = await fetch(`/api${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${response}`)

        }

        return await response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}



export async function getUsers() {
    const token = getToken();
    try {
        const response = await fetch('/api/users', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
              }
           

        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getPosts() {
    const token = getToken();

    try {
        const response = await fetch('/api/posts', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
              }
        })
        
        const posts = await response.json();
        console.log({})

        return posts;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch posts');
    }
}

export async function fetchComments() {
    const token = getToken();

    try {
        const response = await fetch('/api/comments/', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        console.log('response:', response);
        const data = await response.json();
        console.log("comments:", data);

        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch comments');
    }
}

export async function followUser(userId, followerId) {
    const token = getToken();

    try {
        const response = await fetch('api/users/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            },
            credentials: 'include',
            


            body: JSON.stringify({ userId, followerId })
        });

        if (!response.ok) {
            throw new Error('Failed to follow user')
        }

        return response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}


export async function unfollowUser(userId, followerId) {
    const token = getToken();


    try {
        const response = await fetch('/api/users/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            },
            credentials: 'include',
            body: JSON.stringify({ userId, followerId })
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
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${getToken()}`
              }
        });
        if (response.ok) {
            localStorage.removeItem('token');
          } else {
            throw new Error('Logout failed');
          }
      
          return response.json();
        } catch (error) {
          console.error("Logout error:", error);
          throw error;
        }
      }