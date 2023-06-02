import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from './Post'
import UserAvatarRow from './UserAvatarRow';
import { getUsers, getPosts, fetchComments } from '../services/api.service';
import Container from '@mui/material/Container';



function useUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data)
      } catch (error) {
        if (error.status === 401) {
          return navigate("/login")
        }
        console.log(error)

      }
    }
    fetchUsers()

  }, [])
  return users
}


function Feed() {
  const users = useUsers()
  debugger
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    fetchPosts()
  }, []);


  async function fetchPosts() {
    try {
      const postData = await getPosts();
      const commentsData = await fetchComments();
      console.log('Comments data:', commentsData);

      const postWithComments = postData.map((post) => {
        post.comments = commentsData.filter((comment) => comment.post === post._id);
        return post;
      });
      console.log('Comments data:', commentsData);
      setPosts(postWithComments);
    } catch (error) {
      console.error(error);
    }
  }


  console.log(posts); // Debug statement

  return (
    <Container maxWidth="sm">

      <UserAvatarRow users={users} />

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


