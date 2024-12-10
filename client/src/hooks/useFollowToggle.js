import { useState } from "react";
import { followUser, unfollowUser } from "../api/userApi";

const useFollowToggle = (initialState) => {
  const [followedUsers, setFollowedUsers] = useState(initialState);

  const handleFollowToggle = async (userId, userIdToToggle) => {
    const isFollowing = !!followedUsers[userIdToToggle];
    try {
      if (isFollowing) {
        await unfollowUser(userId, userIdToToggle);
      } else {
        await followUser(userId, userIdToToggle);
      }
      setFollowedUsers(prevState => ({
        ...prevState,
        [userIdToToggle]: !isFollowing,
      }));
    } catch (error) {
      console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user:`, error);
    }
  };

  return { followedUsers, handleFollowToggle };
};

export default useFollowToggle;