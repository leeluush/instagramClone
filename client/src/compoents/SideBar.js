import React from "react";
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




function SideBar() {
  const isSmallScreen = useMediaQuery('(max-width:772px), (max-height:577px)');

  return (
    <aside className={`side-bar ${isSmallScreen ? 'side-bar-small' : ''}`}>
      <div>
        {isSmallScreen ? (
          <InstagramIcon />
          ) : (
            <img className="logo" src={logo} alt="logo" />
          )}
      </div>
      <nav>
        <ul>
          <li>
            <div>
              <HomeIcon />
              {!isSmallScreen && <Link to="/">Home</Link>}
            </div>
          </li>
          <li>
            <div>
              <SearchIcon />
              {!isSmallScreen && <Link to="/search">Search</Link>}
            </div>
          </li>
          <li>
            <div>
              <ExploreIcon />
              {!isSmallScreen && <Link to="/explore">Explore</Link>}
            </div>
          </li>
          <li>
            <div>
              <SlideshowIcon />
              {!isSmallScreen && <Link to="/reels">Reels</Link>}
            </div>
          </li>
          <li>
            <div>
              <MessageIcon />
              {!isSmallScreen && <Link to="/messages">Messages</Link>}
            </div>
          </li>
          <li>
            <div>
              <FavoriteBorderIcon />
              {!isSmallScreen && <Link to="/notifications">Notification</Link>}
            </div>
          </li>
          <li>
            <div>
              <AddBoxIcon />
              {!isSmallScreen && <Link to="/create">Create</Link>}
            </div>
          </li>
          <li>
            <div>
              <Avatar />
              {!isSmallScreen && <Link to="/Profile">Profile</Link>}
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideBar;