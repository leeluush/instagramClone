import React, { useEffect, useState } from "react";
import Post from './Post'
import UserAvatarRow from './UserAvatarRow';
import { getUsers, getPosts,fetchComments } from './services/api.service';



function Feed() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUsers()
    fetchPosts()
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data)
    } catch (error) {
      console.log(error)

    }
  }

  async function fetchPosts() {
    try {
      const postData = await getPosts();
      const commentsData = await fetchComments();
      console.log('Comments data:', commentsData);
  
      const postWithComments = postData.map((post) => {
        post.comments = commentsData.filter((comment) => comment.post === post._id);
        return post;
      });
  
      setPosts(postWithComments);
    } catch (error) {
      console.error(error);
    }
  }
  

  console.log(posts); // Debug statement

    return (
      <div className='feed'>
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
      </div>
    );
  }


export default Feed;


