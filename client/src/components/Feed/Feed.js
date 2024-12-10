import React, { useEffect, useState } from "react";
import Post from "./Post";
import { getFeed } from "../../api/feedApi";
import Container from "@mui/material/Container";
import { PostContext } from "../Post/PostContext";
import { useContext } from "react";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { newPost } = useContext(PostContext);


  async function fetchFeed() {
    try {
      const response = await getFeed();
      if (response.data && response.data.posts) {
        setPosts(response.data.posts);
      } else {
        console.error("No posts data received from the server");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchFeed();
  }, [newPost]);

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

    </Container>
  );
}
export default Feed;
