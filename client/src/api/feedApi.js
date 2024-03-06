export async function refreshToken() {
  try {
    const response = await fetch(`/api/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return response.json();
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
}



export async function getFeed(page = 1, limit = 10) {
  try {
    let response = await fetch(`/api/feed?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    if (response.status === 401) {
      await refreshToken();
      response = await fetch(`/api/feed?page=${page}&limit=${limit}`, {
        credentials: "include",
      });
    }
    if (!response.ok) {
      console.log("Response:", response);
      throw new Error("Failed to fetch feed");
    }

    const feed = await response.json();
    return feed;
  } catch (error) {
    console.error(error);
    console.error("Error fetching feed:", error.message);

    throw error;
  }
}

export async function getPosts() {
  try {
    const response = await fetch(`/api/posts`, {
      credentials: "include",
    });

    if (!response.ok) {
      console.log("Response:", response);
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();

    return posts;
  } catch (error) {
    console.error(error);
    console.error("Error fetching posts:", error);

    throw error;
  }
}