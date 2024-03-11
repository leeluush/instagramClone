import React, { useEffect, useState, useCallback } from "react";
import Post from "./Post";
import { getFeed } from "../../api/feedApi";
import { fetchComments } from "../../api/commentApi";
import Container from "@mui/material/Container";
import { PostContext } from "../Post/PostContext";
import { useContext } from "react";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { newPost } = useContext(PostContext);
  const [comments, setComments] = useState({});

  const updateLikeCount = (postId, newLikeCount, newLikedStatus) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, likeCount: newLikeCount, isLiked: newLikedStatus }
          : post
      )
    );
  };

  const fetchAndUpdateComments = useCallback(async (postId) => {
    try {
      const updatedComments = await fetchComments(postId);
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: updatedComments,
      }));
    } catch (error) {
      console.error("Failed to fetch and update comments", error);
    }
  }, []);

  const handlePostDeletion = (postId) => {
    const newPosts = posts.filter((post) => post._id !== postId);
    setPosts(newPosts);
  };

  async function fetchFeed() {
    try {
      const response = await getFeed();
      const postData = response.data;
      if (postData && postData.posts) {
        setPosts(postData.posts);
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
              key={post._id}
              setPosts={setPosts}
              handlePostDeletion={handlePostDeletion}
              likeCount={post.likeCount}
              updateLikeCount={updateLikeCount}
              isLiked={post.isLiked}
              fetchAndUpdateComments={fetchAndUpdateComments}
              comments={comments[post._id] || []}
            />
          </li>
        ))}
      </ul>

    </Container>
  );
}
export default Feed;
