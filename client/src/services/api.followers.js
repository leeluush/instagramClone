import { refreshToken } from "./api.service";

async function fetchWithTokenRefresh(input, init) {
  const response = await fetch(input, { ...init, credentials: "include" });

  if (response.status === 401) {
    const refreshedResponse = await refreshToken();

    if (!refreshedResponse.ok) {
      throw new Error("Failed to refresh token");
    }

    // Retry the request
    return await fetch(input, { ...init, credentials: "include" });
  }

  return response;
}

async function followUserApi(userId) {
  const response = await fetchWithTokenRefresh(
    `/api/followers/follow/${userId}`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to follow the user");
  }
  return response.json();
}

async function unfollowUserApi(followeeId) {
  const response = await fetchWithTokenRefresh(
    `/api/followers/unfollow/${followeeId}`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to unfollow the user");
  }
  const data = await response.json();
  return data;
}

async function checkIfFollowing(userId) {
  const response = await fetchWithTokenRefresh(
    `/api/followers/follow/check/${userId}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to check if following the user");
  }
  const result = await response.json();
  return result.isFollowing;
}

export { followUserApi, unfollowUserApi, checkIfFollowing };
