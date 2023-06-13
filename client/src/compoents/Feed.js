import React, { useEffect, useState } from "react";
import Post from './Post'
import Reels from './Reels';
import { getPosts, fetchComments } from '../services/api.service';
import Container from '@mui/material/Container';


function Feed() {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    fetchPosts()
  }, []);


  async function fetchPosts() {
    try {
      const postData = await getPosts();
   
      const commentsData = await fetchComments();

      const postWithComments = postData.map((post) => {
        post.comments = commentsData.filter((comment) => comment.post === post._id);
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


