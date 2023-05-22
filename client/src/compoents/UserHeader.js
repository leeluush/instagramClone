import React, {useContext} from 'react';
import {UserInfoContext} from '../App'
import './UserHeader.css'


function UserHeader() {
    const { profileImage, userName, userBio } = useContext(UserInfoContext);
  
    return (
      <div className="UserHeader">
        <img src={profileImage} alt={userName} />
        <h1>{userName}</h1>
        <p>{userBio}</p>
      </div>
    );
  }
  
  export default UserHeader; 