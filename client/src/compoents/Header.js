import React from "react";

function Header() {
    return (
      <header className="Header">
        <span>
          <img src="http://via.placeholder/50" alt="logo" />
        </span>
        <nav>
          <ul>
            <li><a href="url">Home</a></li>
            <li><input type="text" placeholder="Search.." /></li>
            <li><a href="url">Explore</a></li>
            <li><a href="url">Reels</a></li>
            <li><a href="url">Messages</a></li>
            <li><a href="url">Notification</a></li>
            <li><a href="url">Create</a></li>
          </ul>
        </nav>
        <div>
          <img src="https://via.placeholder.com/50" alt="" />
        </div>
      </header>
    );
  }
  

export default Header;