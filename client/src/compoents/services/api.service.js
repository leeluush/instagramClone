export async function getUsers() {
    try {
        const response = await fetch('/api/users');
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
        const response = await fetch('/api/posts')
        console.log("response:", response);
        const data = await response.json();
        console.log("Data:", data); // Debug statement
        // Debug statement

        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch posts');
    }
}

export async function fetchComments() {
    try {
        const response = await fetch('/api/comments/');
        console.log('response:', response); 
        const data = await response.json();  
        console.log("comments:", data);  

        return data;  
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch comments');
    }
}

