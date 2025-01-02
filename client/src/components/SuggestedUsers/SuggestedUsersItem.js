import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import defaultStyles from "./SuggestedUserItem.module.css";
import suggestedPageStyles from "./SuggestedUsersPage.module.css";

function SuggestedUserItem({
  user,
  onFollowToggle,
  isFollowing,
  isOnSuggestedPage = false,
}) {
  const { user: currentUser } = useContext(AuthContext); // Access current user from AuthContext

  const itemStyles = isOnSuggestedPage ? suggestedPageStyles : defaultStyles;

  // If the user object is not provided, fall back to the current user
  const displayedUser = user || currentUser;

  if (!displayedUser) {
    console.warn("No user data available for SuggestedUserItem.");
    return null;
  }

  return (
    <div className={itemStyles.SuggestedUserItem}>
      <img
        src={displayedUser.profileImage || "/default-profile.png"}
        alt={displayedUser.userName || "User"}
        className={itemStyles.SuggestedUserImage}
      />
      <div className={itemStyles.SuggestedUserInfo}>
        <span className={itemStyles.SuggestedUserName}>
          {displayedUser.userName || "Anonymous"}
        </span>
        <button
          className={`${itemStyles.FollowButton} ${isFollowing ? itemStyles.Following : ""}`}
          onClick={onFollowToggle}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default SuggestedUserItem;
