import React, { useContext } from "react";
import Sidebar from "./Sidebar"; // Existing Sidebar component
import Header from "./Header"; // Optional new Header component
import { AuthContext } from "../Auth/AuthContext";
import styles from "./styles/SideBar.module.css"; // Reuse existing styles

function MainLayout({ children, showHeader = true }) {
  const { user } = useContext(AuthContext); // Check if user is logged in

  return (
    <div className={styles.mainLayout}>
      {user && <Sidebar />} {/* Show Sidebar only if logged in */}
      <div className={styles.content}>
        {showHeader && <Header />} {/* Show Header based on props */}
        <main>{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
