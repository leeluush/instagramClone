import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {useMediaQuery, box} from '@mui/icons-material';

import React, { createContext } from "react";

import UserHeader from './compoents/UserHeader';
import Feed from './compoents/Feed';
import List from './compoents/List';


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
        <header> </header>
        <main className='Main'>
          <UserHeader className='UserHeader'/>
          <Feed className='Feed'/>

          <List className ="List" cards={['iam a card,', 'another card']}></List>

        </main>
        <footer className='Footer'></footer>
      </div>
    </UserInfoContext.Provider>
  );
}


