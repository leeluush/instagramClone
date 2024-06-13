import React, { useEffect, useState, useContext } from "react";
import Post from "./Post";
import { getFeed } from "../../api/feedApi";
import Container from "@mui/material/Container";
import { PostContext } from "../Post/PostContext";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { newPost } = useContext(PostContext);

  async function fetchFeed(page, limit = 10) {
    setLoading(true);
    try {
      const response = await getFeed(page, limit);
      if (response.data) {
        setPosts((prevPosts) => {
          const newPosts = response.data.filter(
            (post) => !prevPosts.some((p) => p._id === post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      } else {
        console.error("No posts data received from the server");
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  useEffect(() => {
    if (newPost) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  }, [newPost]);

  useEffect(() => {
    const handleScroll = () => {
      const fromBottom = document.documentElement.offsetHeight - (window.innerHeight + document.documentElement.scrollTop);
      if (fromBottom < 100 && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <Container maxWidth="sm">
      <ul className="post-list">
        {posts.map((post, index) => (
          <li key={post._id || index}>
            <Post
              post={post}
              setPosts={setPosts}
              handlePostDeletion={() => {
                const newPosts = posts.filter((p) => p._id !== post._id);
                setPosts(newPosts);
              }}
              comments={post.comments || []}
            />
          </li>
        ))}
      </ul>
      {loading && <div>Loading...</div>}
    </Container>
  );
}

export default Feed;
