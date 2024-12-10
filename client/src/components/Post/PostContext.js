import { createContext, useState } from 'react';

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [newPost, setNewPost] = useState(false); 

  return (
    <PostContext.Provider value={{ newPost, setNewPost }}>
      {children}
    </PostContext.Provider>
  );
}
