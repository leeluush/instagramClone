import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/Auth/AuthContext";

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