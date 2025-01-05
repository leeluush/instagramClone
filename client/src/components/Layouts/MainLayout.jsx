import React, { useContext } from "react";
import Sidebar from "./Sidebar"; // Left Sidebar
import SuggestedUsers from "../SuggestedUsers/SuggestedUsersItem"; // Right Sidebar
import Header from "./Header"; // Header Component
import { AuthContext } from "../Auth/AuthContext";
import styles from "./styles/MainLayout.module.css";

function MainLayout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.mainLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Sidebar user={user} />
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <Header user={user} />

        {/* Stories Section */}
        <div className={styles.storiesContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.storyPlaceholder}>
              Coming Soon
            </div>
          ))}
        </div>

        {/* Feed Section */}
        <section className={styles.feed}>{children}</section>
      </main>

      {/* Right Sidebar */}
      <aside className={styles.suggested}>
        <SuggestedUsers />
      </aside>
    </div>
  );
}

export default MainLayout;
