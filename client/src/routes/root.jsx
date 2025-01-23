import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthContext";
import { useState } from "react";
import { PostContext } from "../components/Post/PostContext";

export default function Root() {
  const { user } = useContext(AuthContext);
  const [newPost, setNewPost] = useState(false);
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
      <Outlet />
    </PostContext.Provider>
  );
}
