import React, {useContext} from 'react';
import {UserInfoContext} from '../App'


function UserHeader() {
    const { userImage, userName, userBio } = useContext(UserInfoContext);
  
    return (
      <div className="UserHeader">
        <img src={userImage} alt={userName} />
        <h1>{userName}</h1>
        <p>{userBio}</p>
      </div>
    );
  }
  
  export default UserHeader; 