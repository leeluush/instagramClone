import React, { useEffect, useState, useContext } from "react";
import Post from "./Post";
import { getFeed } from "../../api/feedApi";
import { PostContext } from "../Post/PostContext";
import styles from "./Feed.module.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { newPost } = useContext(PostContext);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    async function fetchFeed() {
      try {
        setIsLoading(true);
        const response = await getFeed(1);
        const uniquePosts = removeDuplicatePosts(response.data?.posts || []);
        setPosts(uniquePosts);
        setHasMore(response.data?.hasMore || false);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeed();
  }, [newPost]);

  const removeDuplicatePosts = (postsArray) => {
    const seen = new Set();
    return postsArray.filter((post) => {
      const duplicate = seen.has(post._id);
      seen.add(post._id);
      return !duplicate;
    });
  };

  const loadMorePosts = async () => {
    if (isFetchingMore || !hasMore) return;

    try {
      setIsFetchingMore(true);
      const response = await getFeed(page + 1);

      if (response.data) {
        // Remove any duplicates before adding new posts
        const existingPostIds = new Set(posts.map((post) => post._id));
        const newPosts = response.data.posts.filter(
          (post) => !existingPostIds.has(post._id)
        );

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(response.data.hasMore);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts, isFetchingMore, hasMore]);

  const handlePostDeletion = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div className={styles.feedContainer}>
      {posts.map((post) => (
        <article key={`${post._id}`} className={styles.postWrapper}>
          <Post
            post={post}
            setPosts={setPosts}
            handlePostDeletion={() => handlePostDeletion(post._id)}
            comments={post.comments || []}
          />
        </article>
      ))}

      {isFetchingMore && (
        <div className={styles.loadingContainer}>Loading more posts...</div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className={styles.noMorePosts}>No more posts to load</div>
      )}
    </div>
  );
}

export default Feed;
