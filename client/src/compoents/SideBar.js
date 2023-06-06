import React, { useContext, useState } from "react";
import logo from "../logos/inst.png"
import { Link } from "react-router-dom";
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';



import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {logout} from '../services/api.service'


import './SideBar.css';
import { useMediaQuery } from '@mui/material';
import { AuthContext } from './AuthContext'







function SideBar() {
  const { user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();



   const isSmallScreen = useMediaQuery('(max-width:772px), (max-height:577px)');

   const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      navigate('/login');


    } catch (error) {
  // console.log(error); 
    }
  };

  
   if (!user) {
    return <div>Loading...</div>;

  }
  const { userName, profileImage } = user;
  // console.log(user)
  const navLinks = [
    { to: "/", icon: <HomeIcon />, text: "Home" },
    { to: "/search", icon: <SearchIcon />, text: "Search" },
    { to: "/explore", icon: <ExploreIcon />, text: "Explore" },
    { to: "/reels", icon: <SlideshowIcon />, text: "Reels" },
    { to: "/messages", icon: <MessageIcon />, text: "Messages" },
    { to: "/notifications", icon: <FavoriteBorderIcon />, text: "Notification" },
    { to: "/create", icon: <AddBoxIcon />, text: "Create" },
    { to: "/Profile", icon: <Avatar alt={userName} src={profileImage}/>, text: "Profile"   }
  ];

  return (
    <aside className={`side-bar ${isSmallScreen ? 'side-bar-small' : ''}`}>
      <header>
        {isSmallScreen ? (
          <InstagramIcon />
          ) : (
            <img className="logo" src={logo} alt="logo" />
          )}
        </header>
        <nav>
          <ul>
            {navLinks.map((link, index) => (
              <li key={index}>
                <div>
                  {link.icon}
                  {!isSmallScreen && <Link to={link.to}>{link.text}</Link>}
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
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
      </aside>
    );
  }

export default SideBar;   