
import { fetchWithTokenRefresh } from "./utils";


export async function toggleLike(postId, newStatus, userId, isPost = true) {
  const method = newStatus ? "POST" : "DELETE";
  const type = isPost ? "posts" : "comments";
  try {

    const response = await fetchWithTokenRefresh(
      `/api/likes/${type}/${postId}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }

    const data = await response.json();
    console.log("Toggle like successful, received data:", data);
    return data;
  } catch (error) {
    console.error("Could not toggle like:", error);
    throw error;
  }
}




