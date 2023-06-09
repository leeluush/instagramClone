
import UserHeader from "../compoents/UserHeader";
import { AuthContext  } from "../compoents/AuthContext";
import { Outlet , useNavigate} from "react-router-dom";
import { useContext , useEffect } from "react";



export default function Root() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app'); //TODO change this to Feed instead of app. 
      
    }
  }, [user, navigate]);
    return (
        <>
          <UserHeader/>
          <main className='Main'>
            <Outlet />
          </main>
        </>
      );
    }