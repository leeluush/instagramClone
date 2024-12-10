import { fetchWithTokenRefresh, refreshToken } from "./utils";



export async function getSuggestedUsers() {
  try {
    const response = await fetchWithTokenRefresh(`/api/users/suggested-users`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log response status for debugging
    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      // Attempt to read response body for detailed error message
      const errorResponse = await response.text(); // Use .json() if the error response is in JSON format
      console.error(`Failed to fetch suggested users: ${errorResponse}`);
      throw new Error(`Failed to fetch suggested users: Status ${response.status}`);
    }

    const suggestedUsers = await response.json();
    console.log("API Response:", suggestedUsers);
    return suggestedUsers;
  } catch (error) {
    // Log the entire error object
    console.error("Error in getSuggestedUsers:", error);
    throw error;
  }
}


export async function getUsersById(userId) {
  try {
    const response = await fetch(`/users/${userId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



export async function followUser(userId, followerId) {
  try {
    const response = await fetchWithTokenRefresh(`/api/followers/follow/${followerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId, followerId }),
    });

    if (!response.ok) {
      throw new Error("Failed to follow user");
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function unfollowUser(userId, followerId) {
  try {
    const response = await fetchWithTokenRefresh(`/api/followers/unfollow/${followerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userId, followerId }),
    });
    if (!response.ok) {
      throw new Error("Failed to unfollow user");
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
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      localStorage.clear()
    } else {
      throw new Error("Logout failed");
    }
    return response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function fetchUserInfo() {
  try {
    const response = await fetch(`/api/users/userprofile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      const refreshedResponse = await refreshToken();

      if (!refreshedResponse.ok) {
        throw new Error("Failed to refresh token");
      }

      // Attempt to fetch user info again after token refresh
      return fetchUserInfo();
    } else if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    return null;
  }
}

