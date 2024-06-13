import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import InstagramIcon from '@mui/icons-material/Instagram';
import { logout } from "../../api/userApi";
import { AuthContext } from "../Auth/AuthContext";
import { PostContext } from "../Post/PostContext";
import CreatePost from "../CreatePost/CreatePost";
import styles from "./NarrowSideBar.module.css";

const NarrowSideBar = ({ openCreateDialog, setOpenCreateDialog }) => {
  const { user, token } = useContext(AuthContext);
  const { setNewPost } = useContext(PostContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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

  const navLinks = [
    { path: "/", action: () => navigate("/feed"), icon: <HomeIcon /> },
    { action: () => navigate("/feed"), icon: <SearchIcon /> },
    { action: () => navigate("/feed"), icon: <ExploreIcon /> },
    { action: () => navigate("/feed"), icon: <SlideshowIcon /> },
    { action: () => navigate("/feed"), icon: <MessageIcon /> },
    { action: () => navigate("/feed"), icon: <FavoriteBorderIcon /> },
    { action: () => setOpenCreateDialog(true), icon: <AddBoxIcon /> },
    {
      action: () => navigate("/Profile"),
      icon: (
        <Avatar
          alt={user.userName}
          src={user.profileImage}
          className={styles['profile-image']}
          style={{ height: "24px", width: "24px" }}
        />
      ),
    },
  ];

  return (
    <aside className={styles['narrow-side-bar']}>
      <div className={styles['logo-container']}>
        <InstagramIcon style={{ fontSize: '2rem', color: 'black' }} /> {/* Displaying the Instagram Icon */}
      </div>
      <div className={styles['icons-container']}>
        <nav>
          {navLinks.map((link, index) => (
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
      <div className={styles['more-options']}>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          startIcon={<MenuIcon style={{ color: "black" }} />}
        >
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
          onNewPost={() => setNewPost(true)}
        />
      )}
    </aside>
  );
};

export default NarrowSideBar;
