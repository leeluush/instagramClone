import React from "react";
import InstagramLogo from "../../logos/instagramLogo";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import styles from "./styles/SideBar.module.css";

function Sidebar({ user }) {
  const navItems = [
    { label: "Home", icon: <HomeIcon />, route: "/home" },
    { label: "Search", icon: <SearchIcon />, route: "/search" },
    { label: "Reels", icon: <SlideshowIcon />, route: "/reels" },
    { label: "Create", icon: <AddBoxIcon />, action: "create" },
    {
      label: "Notifications",
      icon: <NotificationsIcon />,
      route: "/notifications",
    },
    {
      label: "Profile",
      icon: <Avatar src={user?.profileImage} />,
      route: "/profile",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <InstagramLogo />
      </div>
      <nav className={styles.nav}>
        {navItems.map((item, index) => (
          <button key={index} className={styles.navItem}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
