import React, { useEffect, useState } from "react";
import Post from "./Post";
import { getFeed } from "../../api/feedApi";
import Container from "@mui/material/Container";
import { PostContext } from "../Post/PostContext";
import { useContext } from "react";
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
      if (response.data && response.data.posts) {
        setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
      } else {
        console.error("No posts data received from the server");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  useEffect(() => {
    setPosts([]); // Clear the posts when a new post is added
    fetchFeed(1); // Fetch the first page of the feed
  }, [newPost]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <Container maxWidth="sm">
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post._id}>
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
