import { fetchWithTokenRefresh } from "./utils";

export async function deleteComment(commentId, postId) {
  try {
    const response = await fetchWithTokenRefresh(
      `/api/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete comment");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete comment", error);
  }
}

export async function fetchComments(postId) {
  try {
    const response = await fetchWithTokenRefresh(
      `/api/posts/${postId}/comments`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const responseData = await response.json();
    const comments = responseData.data.comments;
    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editComment(postId, commentId, updateComment) {
  try {
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: updateComment }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error updating the comment", error);
  }
}
export async function postComment(postId, comment) {
  try {
    const response = await fetchWithTokenRefresh(
      `/api/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: postId, content: comment }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to post comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
