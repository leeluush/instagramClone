import React, { useEffect, useState, useContext } from "react";
import Post from "./Post"; // Existing Post Component
import { getFeed } from "../../api/feedApi"; // API to fetch posts
import { PostContext } from "../Post/PostContext"; // Context for new posts
import "./Feed.css"; // Assuming your CSS styles exist

function Feed() {
  const [posts, setPosts] = useState([]); // State to store posts
  const { newPost } = useContext(PostContext); // Listen for new posts

  // Fetch feed data on component mount or when a new post is added
  useEffect(() => {
    async function fetchFeed() {
      try {
        const response = await getFeed();
        setPosts(response.data?.posts || []);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    }
    fetchFeed();
  }, [newPost]); // Refresh feed when a new post is created

  // Handle post deletion without losing other functionality
  const handlePostDeletion = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="feed">
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post._id}>
            <Post
              post={post}
              setPosts={setPosts}
              handlePostDeletion={() => handlePostDeletion(post._id)}
              comments={post.comments || []} // Preserve comments functionality
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;
