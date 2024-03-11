// SuggestedUserItem.js
import React from 'react';
import './SuggestedUserItem.css';

function SuggestedUserItem({ user , onFollowToggle, isFollowing}) {
  return (
    <div className="SuggestedUserItem">
      <img src={user.profileImage} alt={user.userName} className="SuggestedUserImage" />
      <div className="SuggestedUserInfo">
        <span className="SuggestedUserName">{user.userName}</span>
        <button
  className={`FollowButton ${isFollowing ? 'Following' : ''}`}
  onClick={onFollowToggle}
>
  {isFollowing ? 'Following' : 'Follow'}
</button>
      </div>
    </div>
  );
}

export default SuggestedUserItem;
