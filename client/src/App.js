import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { createContext } from "react";

import UserHeader from './compoents/UserHeader';
import Feed from './compoents/Feed';
import SideBar from './compoents/SideBar';



import './App.css'


export const UserInfoContext = createContext({
  userImage: `https://avatars.dicebear.com/api/human/${Math.random()}.svg`,
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
        {user && (
          <>
            <div className='side-bar'>
              <SideBar />
            </div>
            <header><UserHeader className='UserHeader' /></header>
          </>
        )}
        <main className='Main'>
          <Feed className='Feed' />
        </main>
        <footer className='Footer'></footer>
      </div>
    </UserInfoContext.Provider>
  );
}