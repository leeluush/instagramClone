import React from "react";
import defaultStyles from "./SuggestedUserItem.module.css";
import suggestedPageStyles from "./SuggestedUsersPage.module.css";

function SuggestedUserItem({
  user, // Always expect a `user` prop
  onFollowToggle,
  isFollowing,
  isOnSuggestedPage = false,
}) {
  const itemStyles = isOnSuggestedPage ? suggestedPageStyles : defaultStyles;

  // If no `user` is provided, log a warning and do not render the component
  if (!user) {
    console.warn("No user data provided for SuggestedUserItem.");
    return null;
  }

  return (
    <div className={itemStyles.SuggestedUserItem}>
      <img
        src={user.profileImage || "/default-profile.png"}
        alt={user.userName || "User"}
        className={itemStyles.SuggestedUserImage}
      />
      <div className={itemStyles.SuggestedUserInfo}>
        <span className={itemStyles.SuggestedUserName}>
          {user.userName || "Anonymous"}
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
