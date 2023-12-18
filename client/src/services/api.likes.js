import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
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

export async function toggleLike(postId, newStatus, userId, isPost = true) {
  const method = newStatus ? "POST" : "DELETE";
  const type = isPost ? "posts" : "comments";
  try {
    console.log(`Attempting to toggle like for ${type} with ID: ${postId}`);
    console.log(`New Status: ${newStatus}`);
    console.log(`Method: ${method}`);

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

export function usePostLikes(postId, initialLikesCount, initialIsLiked) {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialIsLiked);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/likes/posts/likescount/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setLikes(data.likesCount);
        }
      })
      .catch((err) => console.error(err));

    if (user) {
      fetch(`/api/likes/posts/like/${postId}/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setLiked(data.liked);
        })
        .catch((err) => console.error(err));
    }
  }, [postId, user]);

  const handleLike = async () => {
    try {
      const newStatus = !liked;
      const updatedLikes = await toggleLike(postId, newStatus, user._id);
      console.log(updatedLikes);
      setLikes(updatedLikes.likeCount);
      setLiked(newStatus);
      return updatedLikes;
    } catch (error) {
      console.error("Could not update like status:", error);
    }
  };

  return { likes, liked, handleLike };
}

export function useCommentLikes(commentId) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [likes, setLikes] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/likes/comments/likescount/${commentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setLikes(data.likesCount);
        }
      })
      .catch((err) => console.error(err));

    if (user) {
      fetch(`/api/likes/comments/like/${commentId}`)
        .then((res) => res.json())
        .then((data) => {
          setLiked(data.liked);
        })
        .catch((err) => console.error(err));
    }
  }, [commentId, user]);

  const handleLike = () => {
    if (!user) {
      navigate("./login");
      return;
    }

    const method = liked ? "DELETE" : "POST";
    const url = `/api/likes/comments/${commentId}`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setLikes((prevLikes) => prevLikes + (liked ? -1 : 1));
        setLiked(!liked);
      })
      .catch((err) => console.error(err));
  };

  return { likes, liked, handleLike };
}
