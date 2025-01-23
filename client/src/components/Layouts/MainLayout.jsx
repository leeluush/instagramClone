import React, { useContext, useRef } from "react";
import Sidebar from "./Sidebar";
import UserHeader from "../Shared/UserHeader";
import styles from "./styles/MainLayout.module.css";
import { AuthContext } from "../Auth/AuthContext";

const MainLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const storiesScrollRef = useRef(null);

  const scroll = (direction) => {
    if (storiesScrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      storiesScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.mainLayout}>
      <aside className={styles.sidebar}>
        <Sidebar user={user} />
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.storiesWrapper}>
          <button
            className={`${styles.scrollButton} ${styles.scrollLeft}`}
            onClick={() => scroll("left")}
          >
            ‹
          </button>
          <div className={styles.storiesScroll} ref={storiesScrollRef}>
            <div className={styles.storiesContainer}>
              {Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className={styles.storyItem}>
                  <div className={styles.storyCircle}>
                    <span className={styles.storyText}>Coming...</span>
                  </div>
                  <span className={styles.storyLabel}>Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
          <button
            className={`${styles.scrollButton} ${styles.scrollRight}`}
            onClick={() => scroll("right")}
          >
            ›
          </button>
        </div>

        <section className={styles.feed}>{children}</section>
      </main>

      <aside className={styles.suggested}>
        <UserHeader />
      </aside>
    </div>
  );
};
export default MainLayout;
