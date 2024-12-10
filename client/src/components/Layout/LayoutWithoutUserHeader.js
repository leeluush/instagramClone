import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { PostContext } from "../Post/PostContext";
import { useState } from "react";

function LayoutWithoutUserHeader() {
  const [newPost, setNewPost] = useState(false);

  return (
    <PostContext.Provider value={{ newPost, setNewPost }}>
    <div className="App">
      <div className="SideBar">
        <SideBar />
      </div>
      <main className="Main">
        <Outlet />
      </main>
      </div>
      </PostContext.Provider>

  );
}

export default LayoutWithoutUserHeader;
