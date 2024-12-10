import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";

import InstagramLogo from "../../logos/instagramLogo";
import InstagramIcon from "@mui/icons-material/Instagram";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import MessageIcon from "@mui/icons-material/Message";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CreatePost from "../CreatePost/CreatePost";
import { PostContext } from "../Post/PostContext";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { logout } from "../../api/userApi";

import styles from "./SideBar.module.css";
import { useMediaQuery } from "@mui/material";
import { AuthContext } from "../Auth/AuthContext";

function SideBar() {
  const { user, token } = useContext(AuthContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { setNewPost } = useContext(PostContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isMediumScreen = useMediaQuery('(min-width:767px) and (max-width:992px)');
  const isSmallScreen = useMediaQuery('(max-width:766px)');

  const handleLogout = async () => {
    handleClose();
    try {
      await logout(token);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNewPost = () => {
    setNewPost(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  const { userName, profileImage } = user;

  const navLinks = [
    { path: "/", action: () => navigate("/feed"), icon: <HomeIcon />, text: "Home" },
    { action: () => navigate("/feed"), icon: <SearchIcon />, text: "Search" },
    { action: () => navigate("/feed"), icon: <ExploreIcon />, text: "Explore" },
    { action: () => navigate("/feed"), icon: <SlideshowIcon />, text: "Reels" },
    { action: () => navigate("/feed"), icon: <MessageIcon />, text: "Messages" },
    { action: () => navigate("/feed"), icon: <FavoriteBorderIcon />, text: "Notification" },
    { action: () => setOpenCreateDialog(true), icon: <AddBoxIcon />, text: "Create" },
    {
      action: () => navigate("/Profile"),
      icon: (
        <div className={styles['profile-container']}>
          <Avatar alt={userName} src={profileImage} className={styles['profile-image']} style={{ height: "24px", width: "24px", paddingTop: "1px", marginRight: "5px" }} />
          <span className={`${styles['link-text']} ${styles['profile-text']}`}>Profile</span>
        </div>
      ),
    },
  ];

  const topBarIcons = isSmallScreen ? [navLinks[0], navLinks[1], navLinks[5]] : [];
  const bottomBarIcons = isSmallScreen ? navLinks.slice(2, 5).concat(navLinks[6]) : navLinks;

  return (
    <aside className={isSmallScreen ? styles['side-bar-small'] : isMediumScreen ? styles['side-bar-medium'] : styles['side-bar']}>
      {!isSmallScreen && (
        <header className={styles['logo-container']}>
          {isMediumScreen ? <InstagramIcon sx={{ fontSize: '24px' }} className={styles['instagram-icon']} /> : <InstagramLogo />}
        </header>
      )}

      {isSmallScreen && (
        <div className={styles['top-bar']}>
          <nav>
            {topBarIcons.map((link, index) => (
              <button
                key={index}
                onClick={link.action}
                className={location.pathname === link.path ? `${styles['nav-item']} ${styles['nav-item-active']}` : styles['nav-item']}
              >
                {link.icon}
              </button>
            ))}
          
          </nav>
        </div>
      )}

      <div className={styles['icons-container']}>
        <nav>
          {bottomBarIcons.map((link, index) => (
            <button
              key={index}
              onClick={link.action}
              className={location.pathname === link.path ? `${styles['nav-item']} ${styles['nav-item-active']}` : styles['nav-item']}
            >
              {link.icon}
              <span className={location.pathname === link.path ? styles['link-text-bold'] : styles['link-text']}>
                {link.text}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className={styles['more-options']}>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          startIcon={<MenuIcon style={{ color: "black" }} />}
        >
          <span className={isMediumScreen ? styles['hide-text'] : ''} style={{ color: 'black' }}>More</span>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout} style={{ color: 'black' }}>Logout</MenuItem>
        </Menu>
      </div>

      {openCreateDialog && (
        <CreatePost
          handleClose={() => setOpenCreateDialog(false)}
          open={openCreateDialog}
          onNewPost={handleNewPost}
        />
      )}
    </aside>
  );
}

export default SideBar;
