export async function sendJson(body, method, url) {

    try {
        const response = await fetch(`/api${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
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
    try {
        const response = await fetch('/api/users', {
            credentials: 'include'

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
    try {
        const response = await fetch('/api/posts', {
            credentials: 'include'
        })

        const data = await response.json();


        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch posts');
    }
}

export async function fetchComments() {
    try {
        const response = await fetch('/api/comments/', {
            credentials: 'include'
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

    try {
        const response = await fetch('api/users/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
    try {
        const response = await fetch('/api/users/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        return response.json();
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}