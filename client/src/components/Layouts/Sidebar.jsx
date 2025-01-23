import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InstagramLogo from "../../logos/instagramLogo";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { PostContext } from "../Post/PostContext";
import { AuthContext } from "../Auth/AuthContext";
import CreatePost from "../CreatePost/CreatePost";
import { logout } from "../../api/userApi";
import styles from "./styles/SideBar.module.css";

function Sidebar() {
  const { user, token } = useContext(AuthContext);
  const { setNewPost } = useContext(PostContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  if (!user) return <div>Loading...</div>;

  const { userName, profileImage } = user;

  const handleLogout = async () => {
    handleClose();
    try {
      await logout(token);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (route, action) => {
    if (action) {
      action();
    } else {
      navigate(route);
    }
  };

  const navItems = [
    {
      label: "Home",
      icon: <HomeIcon sx={{ fontSize: 24 }} />,
      route: "/feed",
    },
    {
      label: "Search",
      icon: <SearchIcon sx={{ fontSize: 24 }} />,
      route: "/search",
    },
    {
      label: "Explore",
      icon: <ExploreIcon sx={{ fontSize: 24 }} />,
      route: "/explore",
    },
    {
      label: "Reels",
      icon: <SlideshowIcon sx={{ fontSize: 24 }} />,
      route: "/reels",
    },
    {
      label: "Messages",
      icon: <ChatIcon sx={{ fontSize: 24 }} />,
      route: "/messages",
    },
    {
      label: "Notifications",
      icon: <FavoriteBorderIcon sx={{ fontSize: 24 }} />,
      route: "/notifications",
    },
    {
      label: "Create",
      icon: <AddBoxIcon sx={{ fontSize: 24 }} />,
      action: () => setOpenCreateDialog(true),
    },
    {
      label: "Profile",
      icon: (
        <Avatar
          src={profileImage}
          sx={{
            width: 24,
            height: 24,
          }}
        />
      ),
      route: `/profile/${userName}`,
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <InstagramLogo />
      </div>

      <nav className={styles.nav}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`${styles.navItem} ${
              location.pathname === item.route ? styles.active : ""
            }`}
            onClick={() => handleNavigation(item.route, item.action)}
          >
            <div className={styles.iconContainer}>{item.icon}</div>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}

        {/* More Button */}
        <button
          className={`${styles.navItem} ${styles.moreButton}`}
          onClick={handleMenuClick}
        >
          <div className={styles.iconContainer}>
            <MenuIcon sx={{ fontSize: 24 }} />
          </div>
          <span className={styles.navLabel}>More</span>
        </button>
      </nav>

      {/* Menu */}
      <Menu
        id="nav-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            "& .MuiMenuItem-root": {
              fontSize: "14px",
              padding: "12px 16px",
            },
          },
        }}
      >
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>

      {openCreateDialog && (
        <CreatePost
          open={openCreateDialog}
          handleClose={() => setOpenCreateDialog(false)}
          onNewPost={() => setNewPost(true)}
        />
      )}
    </div>
  );
}

export default Sidebar;
