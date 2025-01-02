import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import MainLayout from "../Layouts/MainLayout";
import SuggestedUserItem from "./SuggestedUsersItem";
import useSuggestedUsers from "../../hooks/useSuggestedUsers";
import useFollowToggle from "../../hooks/useFollowToggle";

import styles from "./SuggestedUsersPage.module.css";

function SuggestedUsersPage() {
  const { user } = useContext(AuthContext);
  const { suggestedUsers, isLoading } = useSuggestedUsers(user);
  const initialState = suggestedUsers.reduce(
    (state, user) => ({ ...state, [user._id]: user.isFollowing }),
    {}
  );
  const { followedUsers, handleFollowToggle } = useFollowToggle(initialState);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="suggested-users-page">
      <h1>Suggested Users</h1>
      {suggestedUsers.map((suggestedUser) => (
        <SuggestedUserItem
          key={suggestedUser._id}
          user={suggestedUser}
          isOnSuggestedPage={true}
          onFollowToggle={() => handleFollowToggle(user._id, suggestedUser._id)}
          isFollowing={!!followedUsers[suggestedUser._id]}
        />
      ))}
    </div>
  );
}

export default SuggestedUsersPage;
