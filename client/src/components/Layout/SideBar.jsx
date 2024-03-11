import React, { useContext, useState } from "react";
import InstagramLogo from "../../logos/instagramLogo";
import InstagramIcon from "@mui/icons-material/Instagram";
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

import "./SideBar.css";
import { useMediaQuery } from "@mui/material";
import { AuthContext } from "../Auth/AuthContext";

function SideBar() {
  const { user, token } = useContext(AuthContext);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { setNewPost } = useContext(PostContext);

  const isSmallScreen = useMediaQuery("(max-width:772px), (max-height:577px)");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
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
  const { userName, profileImage } = user;

  const navLinks = [
    { action: () => navigate("/"), icon: <HomeIcon />, text: "Home" },
    { action: () => navigate("/search"), icon: <SearchIcon />, text: "Search" },
    {
      action: () => navigate("/explore"),
      icon: <ExploreIcon />,
      text: "Explore",
    },
    {
      action: () => navigate("/reels"),
      icon: <SlideshowIcon />,
      text: "Reels",
    },
    {
      action: () => navigate("/messages"),
      icon: <MessageIcon />,
      text: "Messages",
    },
    {
      action: () => navigate("/notifications"),
      icon: <FavoriteBorderIcon />,
      text: "Notification",
    },
    {
      action: () => setOpenCreateDialog(true),
      icon: <AddBoxIcon />,
      text: "Create",
    },
    {
      action: () => navigate("/Profile"),
      icon: (
        <Avatar alt={userName} src={profileImage} className="profile-image" />
      ),
      text: "Profile",
    },
  ];

  return (
    <aside className={isSmallScreen ? "side-bar side-bar-small" : "side-bar"}>
      <header>{isSmallScreen ? <InstagramIcon /> : <InstagramLogo />}</header>
      <nav>
        <ul>
          {navLinks.map((link, index) => (
            <li key={index} onClick={link.action}>
              <div className="icon">{link.icon}</div>
              <span className="link-text">{link.text}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="more-options">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          More
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
