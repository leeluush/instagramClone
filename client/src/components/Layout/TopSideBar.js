import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import styles from './TopSideBar.module.css';

function TopSideBar() {
    const navigate = useNavigate();

    const navLinks = [
        { path: "/", icon: <HomeIcon />, text: "Home" },
        { path: "/search", icon: <SearchIcon />, text: "Search" },
        { path: "/explore", icon: <ExploreIcon />, text: "Explore" },
        { path: "/reels", icon: <SlideshowIcon />, text: "Reels" },
        { path: "/messages", icon: <MessageIcon />, text: "Messages" },
        { path: "/notifications", icon: <FavoriteBorderIcon />, text: "Notifications" }
    ];

    return (
        <div className={styles.topSideBar}>
            {navLinks.map((link, index) => (
                <button key={index} onClick={() => navigate(link.path)} className={styles.navItem}>
                    {link.icon}
                    <span className={styles.linkText}>{link.text}</span>
                </button>
            ))}
        </div>
    );
}

export default TopSideBar;
