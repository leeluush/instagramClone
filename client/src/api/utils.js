export async function sendJson(body, method, url) {
  try {
    const response = await fetch(`${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

export async function fetchWithTokenRefresh(input, init) {
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