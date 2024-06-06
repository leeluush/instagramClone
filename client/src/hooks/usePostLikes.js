import { useState, useContext } from "react";
import { AuthContext } from "../components/Auth/AuthContext";
import { toggleLike } from "../api/likesApi";


export function usePostLikes(postId, initialLikesCount, initialIsLiked) {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialIsLiked);

  const handleLike = async () => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    console.log(`Toggling like. Current status: ${liked}, Likes: ${likes}`);
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);

    try {
      const response = await toggleLike(postId, !liked, user._id);
      console.log("Like toggled successfully:", response);
    } catch (error) {
      console.error("Could not update like status:", error);
      setLiked(liked);
      setLikes(liked ? likes + 1 : likes - 1);
    }
  };

  return { likes, liked, handleLike };
}
