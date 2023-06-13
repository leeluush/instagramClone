import React, {useContext} from 'react';
import { AuthContext } from '../compoents/AuthContext'
import './UserHeader.css'


function UserHeader() {

  const { user } = useContext(AuthContext);
  
    if (!user) {
      return <div>Loading user information... </div>;
    }
  
    const { profileImage, userName, email } = user || {};
  
    if(!profileImage || !userName || !email) {
      return null;
    }
  
    return (
      <div className="UserHeader">
        <img src={profileImage} alt={userName} />
        <h1>{userName}</h1>
      </div>
    );
  }
    
  export default UserHeader;