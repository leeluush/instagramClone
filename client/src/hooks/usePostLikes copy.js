import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/Auth/AuthContext";
import { toggleLike } from "../api/likesApi";


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