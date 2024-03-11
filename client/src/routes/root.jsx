import UserHeader from "../components/Shared/UserHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import SideBar from "../components/Layout/SideBar";
import { AuthContext } from "../components/Auth/AuthContext";
import { useState } from "react";
import { PostContext } from "../components/Post/PostContext";

export default function Root() {
  const { user } = useContext(AuthContext);
  const [newPost, setNewPost] = useState(false);

  const handleNewPost = () => {
    setNewPost((prevState) => !prevState);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/feed");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <PostContext.Provider value={{ newPost, setNewPost }}>
      <div className="App">
        {user && <UserHeader />}
        <div className="SideBar">
          {user && <SideBar onNewPost={handleNewPost} />}
        </div>
        <main className="Main">
          <Outlet newPost={newPost} />
        </main>
        <footer className="Footer"></footer>
      </div>
    </PostContext.Provider>
  );
}
