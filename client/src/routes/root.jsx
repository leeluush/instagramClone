import UserHeader from "../compoents/UserHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import SideBar from "../compoents/SideBar";
import { AuthContext } from "../compoents/AuthContext";



export default function Root() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className='App'>
      {user && <UserHeader />}
      <div className='side-bar'>
        {user && <SideBar />}
      </div>
      <main className='Main'>
        <Outlet />
      </main>
      <footer className='Footer'></footer>
    </div>
  );
}