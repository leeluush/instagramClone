import React from "react";
import Post from './Post'

function Feed({ posts }) {
    return (
      <div className='feed'>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <Post
                post={post}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  export default Feed;