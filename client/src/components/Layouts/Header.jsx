import React from "react";
import ThreadsIcon from "@mui/icons-material/Forum";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Avatar from "@mui/material/Avatar";
import styles from "./styles/Header.module.css";

function Header({ user }) {
  return (
    <header className={styles.header}>
      {/* Center: Stories Placeholder */}
      <div className={styles.stories}>
        <ul>
          {[...Array(5)].map((_, index) => (
            <li key={index} className={styles.storyPlaceholder}>
              <div className={styles.circle}></div>
              <span>Coming Soon</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Threads, Notifications, and Profile */}
      <div className={styles.right}>
        <button className={styles.iconButton}>
          <ThreadsIcon />
        </button>
        <button className={styles.iconButton}>
          <FavoriteIcon />
        </button>
        <Avatar src={user?.profileImage} alt={user?.userName} />
      </div>
    </header>
  );
}

export default Header;
