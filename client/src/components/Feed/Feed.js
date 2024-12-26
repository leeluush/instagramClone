import React, { useEffect, useState } from "react";
import MainLayout from "../Layouts/MainLayout";
import Post from "./Post";
import { getFeed } from "../../api/feedApi";
import { PostContext } from "../Post/PostContext";
import { useContext } from "react";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { newPost } = useContext(PostContext);

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
  }, [newPost]);

  return (
    <MainLayout>
      <div className="feed-container">
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id}>
              <Post
                post={post}
                setPosts={setPosts}
                handlePostDeletion={() =>
                  setPosts(posts.filter((p) => p._id !== post._id))
                }
                comments={post.comments || []}
              />
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
}

export default Feed;
