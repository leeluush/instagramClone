import React, { useEffect, useState } from "react";
import Post from './Post'
import Reels from './Reels';
import { getPosts  } from '../services/api.service';
import Container from '@mui/material/Container';
import { fetchComments } from "../services/api.comments";


function Feed() {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    fetchPosts()
  }, []);


  async function fetchPosts() {

    try {
      const postData = await getPosts();
      
      const commentsData = await Promise.all(postData.map(async (post) => {
        return fetchComments(post._id); // Pass postId to fetchComments
      }))

      const postWithComments = postData.map((post, index) => {
        post.comments = commentsData[index];
        return post;
      });
      setPosts(postWithComments);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <Container maxWidth="sm">

      <Reels/>

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post._id}>
            <Post
              post={post} key={post._id}
            />
          </li>
        ))}
      </ul>
    </Container>


  );
}


export default Feed;


