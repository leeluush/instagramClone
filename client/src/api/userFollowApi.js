import { fetchWithTokenRefresh } from "./utils";

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
