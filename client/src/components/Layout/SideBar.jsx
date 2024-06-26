import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InstagramLogo from "../../logos/instagramLogo";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import MessageIcon from "@mui/icons-material/Message";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";
import { AuthContext } from "../Auth/AuthContext";
import { PostContext } from "../Post/PostContext";
import NarrowSideBar from "./NarrowSideBar";
import { logout } from "../../api/userApi";
import CreatePost from "../CreatePost/CreatePost";
import styles from "./SideBar.module.css";

function SideBar() {
  const { user, token } = useContext(AuthContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { setNewPost } = useContext(PostContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isMediumScreen = useMediaQuery('(min-width:767px) and (max-width:992px)');
  const isSmallScreen = useMediaQuery('(max-width:766px)');
  const isShortScreen = useMediaQuery('(max-height:650px)');

  const handleLogout = async () => {
    try {
      await logout(token);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNewPost = () => {
    setNewPost(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (isMediumScreen || isSmallScreen) {
    return (
      <NarrowSideBar 
        user={user} 
        setNewPost={setNewPost} 
        handleLogout={handleLogout} 
        openCreateDialog={openCreateDialog} 
        setOpenCreateDialog={setOpenCreateDialog} 
      />
    );
  }

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
        <Avatar
          alt={user.userName}
          src={user.profileImage}
          className={styles['profile-image']}
        />
      ),
      text: "Profile"
    },
  ];

  return (
    <aside className={styles['side-bar']}>
      <header className={styles['logo-container']}>
        <InstagramLogo />
      </header>
      <div className={styles['icons-container']}>
        <nav>
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={link.action}
              className={location.pathname === link.path ? `${styles['nav-item']} ${styles['nav-item-active']}` : styles['nav-item']}
              style={{ display: isShortScreen && (index > 4) ? 'none' : 'flex' }} // Hides icons based on index when screen is short

            >
              {link.icon}
              <span className={styles['link-text']}>{link.text}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className={styles['more-options']}>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          startIcon={<MenuIcon style={{ color: "black" }} />}
        >
          <span style={{ color: 'black' }}>More</span>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
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
