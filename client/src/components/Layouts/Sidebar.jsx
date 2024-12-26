// Refactored and enhanced snippet from SideBar.jsx
// Switching now depends on screen size and integrates dynamic actions better.

import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery, Button, Menu, MenuItem } from "@mui/material";
import InstagramLogo from "../../logos/instagramLogo";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import CreatePost from "../CreatePost/CreatePost";
import { AuthContext } from "../Auth/AuthContext";
import { PostContext } from "../Post/PostContext";
import styles from "./styles/SideBar.module.css";

const navItems = [
  { label: "Home", icon: <HomeIcon />, route: "/home" },
  { label: "Search", icon: <SearchIcon />, route: "/search" },
  { label: "Explore", icon: <ExploreIcon />, route: "/explore" },
  { label: "Reels", icon: <SlideshowIcon />, route: "/reels" },
  { label: "Messages", icon: <MessageIcon />, route: "/messages" },
  {
    label: "Notifications",
    icon: <NotificationsIcon />,
    route: "/notifications",
  },
  { label: "Create", icon: <AddBoxIcon />, action: "create" },
  { label: "Profile", icon: "avatar" },
];

export default function SideBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setNewPost } = useContext(PostContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isSmallScreen = useMediaQuery("(max-width:766px)");

  const handleAction = (action) => {
    if (action === "create") {
      setOpenCreateDialog(true);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderNavItem = ({ label, icon, route, action }) => {
    if (action === "create") {
      return (
        <button
          key={label}
          onClick={() => handleAction(action)}
          className={styles.navItem}
        >
          {icon}
          {!isSmallScreen && <span className={styles.navLabel}>{label}</span>}
        </button>
      );
    } else if (icon === "avatar") {
      return (
        <button
          key={label}
          onClick={() => navigate("/profile")}
          className={styles.navItem}
        >
          <Avatar
            alt={user.userName}
            src={user.profileImage}
            className={styles.avatar}
          />
          {!isSmallScreen && <span className={styles.navLabel}>{label}</span>}
        </button>
      );
    } else {
      return (
        <button
          key={label}
          onClick={() => navigate(route)}
          className={
            pathname === route
              ? `${styles.navItem} ${styles.active}`
              : styles.navItem
          }
        >
          {icon}
          {!isSmallScreen && <span className={styles.navLabel}>{label}</span>}
        </button>
      );
    }
  };

  return (
    <aside className={styles.sideBar}>
      {!isSmallScreen && (
        <header className={styles.logoContainer}>
          <InstagramLogo />
        </header>
      )}
      <nav className={styles.navContainer}>{navItems.map(renderNavItem)}</nav>
      <div className={styles.moreOptions}>
        <Button
          aria-controls="more-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          startIcon={<MenuIcon />}
        >
          {!isSmallScreen && <span className={styles.navLabel}>More</span>}
        </Button>
        <Menu
          id="more-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </div>
      {openCreateDialog && (
        <CreatePost
          handleClose={() => setOpenCreateDialog(false)}
          open={openCreateDialog}
          onNewPost={() => setNewPost(true)}
        />
      )}
    </aside>
  );
}
