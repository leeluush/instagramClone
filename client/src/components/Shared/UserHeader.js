import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import SuggestedUserItem from "./SuggestedUsersItem";
import { getSuggestedUsers, followUser,unfollowUser } from '../../api/userApi';

import "./UserHeader.css";

function UserHeader() {
  const { user } = useContext(AuthContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      setIsLoading(true); 
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        const response = await getSuggestedUsers(); 
        const users = response.data.users.slice(0, 5);
        setSuggestedUsers(users);
        const initialFollowStatus = users.reduce((acc, curr) => ({
          ...acc,
          [curr._id]: curr.isFollowing,
        }), {});
        setFollowedUsers(initialFollowStatus);

      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchSuggestedUsers();
  }, [user]);

  const handleFollowToggle = async (userIdToToggle) => {
    const isFollowing = !!followedUsers[userIdToToggle];
    try {
      if (isFollowing) {
        await unfollowUser(user._id, userIdToToggle);
      } else {
        await followUser(user._id, userIdToToggle);
      }
      // Update the followed state
      setFollowedUsers(prevState => ({
        ...prevState,
        [userIdToToggle]: !isFollowing,
      }));
    } catch (error) {
      console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user:`, error);
    }
  };



  const { profileImage, userName, email } = user || {};

  if (!profileImage || !userName || !email) {
    return null;
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
          <button className="SeeAllButton">See All</button>
        </div>
        <div className="SuggestedUsers">
          {suggestedUsers.map((suggestedUser) => (
            <SuggestedUserItem key={suggestedUser._id} user={suggestedUser} onFollowToggle={() => handleFollowToggle(suggestedUser._id)}       isFollowing={!!followedUsers[suggestedUser._id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
