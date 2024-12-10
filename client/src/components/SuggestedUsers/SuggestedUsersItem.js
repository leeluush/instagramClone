// SuggestedUserItem.js
import React from 'react';
import defaultStyles from './SuggestedUserItem.module.css';
import suggestedPageStyles from './SuggestedUsersPage.module.css'; 


function SuggestedUserItem({ user, onFollowToggle, isFollowing, isOnSuggestedPage = false }) {
  const itemStyles = isOnSuggestedPage ? suggestedPageStyles : defaultStyles;
  return (
    <div className={itemStyles.SuggestedUserItem}>
      <img src={user.profileImage} alt={user.userName} className={itemStyles.SuggestedUserImage} />
      <div className={itemStyles.SuggestedUserInfo}>
      <span className={itemStyles.SuggestedUserName}>{user.userName}</span>
        <button
          className={`${itemStyles.FollowButton} ${isFollowing ? itemStyles.Following : ''}`}
          onClick={onFollowToggle}
>
  {isFollowing ? 'Following' : 'Follow'}
</button>
      </div>
    </div>
  );
}

export default SuggestedUserItem;
