import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import React, { createContext } from "react";
import Header from './compoents/Header';
import UserHeader from './compoents/UserHeader';
import Feed from './compoents/Feed';
import List from './compoents/List';


import './App.css'





const posts = [
  {
    id: 1,
    userImage: "https://via.placeholder.com/50",
    userName: "user1",
    createdTime: "10 minutes ago",
    media: "https://via.placeholder.com/500",
    likesNumber: 15,
    content: "This is a sample post content",
  },
  {
    id: 2,
    userImage: "https://via.placeholder.com/50",
    userName: "user2",
    createdTime: "1 hour ago",
    media: "https://via.placeholder.com/500",
    likesNumber: 30,
    content: "Another sample post content",
  },
];








export const UserInfoContext = createContext({
  userImage: "https://via.placeholder.com/50",
  userName: "Taylor Swift",
  userBio: "A mastermind"
})






export default function App() {
  const user = {
    userImage: "http://via.placeholder.com/50",
    userName: "Kanye west",
    userBio: "a genuies"
  }

  return (
    <UserInfoContext.Provider value={user}>
      <div className='App'>
        <Header/>
        <main className='Main'>
          <UserHeader className='UserHeader'/>
          <Feed className='Feed' posts={posts} />

          <List className ="List" cards={['iam a card,', 'another card']}></List>

        </main>
        <footer className='Footer'></footer>
      </div>
    </UserInfoContext.Provider>
  );
}


