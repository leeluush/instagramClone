import React from "react";
import { useMediaQuery } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Avatar from "@mui/material/Avatar";
import styles from "./styles/Header.module.css";

function Header({ user }) {
  const isSmallScreen = useMediaQuery("(max-width: 766px)");

  return (
    <header className={styles.header}>
      {isSmallScreen && (
        <>
          {/* Logo */}
          <div className={styles.left}>
            <img
              src="/path-to-your-logo/logo-icon.png"
              alt="Instagram"
              className={styles.logo}
            />
          </div>

          {/* Notification Icon */}
          <div className={styles.center}>
            <button className={styles.navItem}>
              <FavoriteIcon />
            </button>
          </div>

          {/* User Avatar */}
          <div className={styles.right}>
            <Avatar
              src={user?.profileImage}
              alt="User Avatar"
              className={styles.avatar}
            />
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
