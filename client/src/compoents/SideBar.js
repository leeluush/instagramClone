import React, { useContext } from "react";
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
import './SideBar.css';
import { useMediaQuery } from '@mui/material';
import { AuthContext } from '../pages/context/AuthContext';





function SideBar() {
  const { user } = useContext(AuthContext);
   const isSmallScreen = useMediaQuery('(max-width:772px), (max-height:577px)');
  
   if (!user) {
    return null;
  }

  const navLinks = [
    { to: "/", icon: <HomeIcon />, text: "Home" },
    { to: "/search", icon: <SearchIcon />, text: "Search" },
    { to: "/explore", icon: <ExploreIcon />, text: "Explore" },
    { to: "/reels", icon: <SlideshowIcon />, text: "Reels" },
    { to: "/messages", icon: <MessageIcon />, text: "Messages" },
    { to: "/notifications", icon: <FavoriteBorderIcon />, text: "Notification" },
    { to: "/create", icon: <AddBoxIcon />, text: "Create" },
    { to: "/Profile", icon: <Avatar />, text: "Profile" },
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
      </aside>
    );
  }

export default SideBar;