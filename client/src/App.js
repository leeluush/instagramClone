import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { createContext } from "react";

import Feed from './compoents/Feed';
import SideBar from './compoents/SideBar';
import UserHeader from './compoents/UserHeader';
import { AuthProvider } from './compoents/AuthContext'




import './App.css'


export const UserInfoContext = createContext({
  userImage: `https://avatars.dicebear.com/api/human/${Math.random()}.svg`,
  userName: "Taylor Swift",
  userBio: "A mastermind"
})

//TODO: to merged with route (it's needed to be up) 

export default function App() {
  const user = {
    userImage: "http://via.placeholder.com/50",
    userName: "Kanye west",
    userBio: "a genuies"
  }
  return (
  <AuthProvider>
    
    <UserInfoContext.Provider value={user}>
      <div className='App'>
        {user && (
          <>
              <UserHeader/>
            <div className='side-bar'>
              <SideBar />
            </div>
          </>
        )}
        <main className='Main'>
          <Feed className='Feed' />
        </main>
        <footer className='Footer'></footer>
      </div>
    </UserInfoContext.Provider>
    </AuthProvider>
  );
}