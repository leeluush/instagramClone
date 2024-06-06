import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import SuggestedUserItem from "../SuggestedUsers/SuggestedUsersItem";
import useSuggestedUsers from "../../hooks/useSuggestedUsers";
import useFollowToggle from "../../hooks/useFollowToggle";
import { useNavigate } from "react-router-dom";

import "./UserHeader.css";

function UserHeader() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { suggestedUsers, isLoading } = useSuggestedUsers(user);
  const initialState = suggestedUsers.reduce(
    (state, user) => ({ ...state, [user._id]: user.isFollowing }),
    {}
  );
  const { followedUsers, handleFollowToggle } = useFollowToggle(initialState);


  const handleSeeAllClick = () => {
    navigate("/suggested-for-you");
  };

 
  const { profileImage, userName, email } = user || {};

  if (!profileImage || !userName || !email) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="UserHeader">
      <div className="UserProfile">
        <img src={profileImage} alt={userName} className="UserProfileImage" />
        <div className="UserInfo">
          <h1>{userName}</h1>
          <p>{email}</p>
        </div>
      </div>
      <div className="SuggestedUsersSection">
        <div className="SuggestedUsersHeader">
          <h2>Suggested for you</h2>
          <button className="SeeAllButton" onClick={handleSeeAllClick}>
            See All
          </button>
        </div>
        <div className='SuggestedUsers'>
          {suggestedUsers.slice(0, 5).map((suggestedUser) => (
            
            <SuggestedUserItem
              key={suggestedUser._id}
              user={suggestedUser}
              onFollowToggle={() => handleFollowToggle(user._id,suggestedUser._id)}
              isFollowing={!!followedUsers[suggestedUser._id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
