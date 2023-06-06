import UserHeader from "../compoents/UserHeader";

import { AuthContext  } from "../compoents/AuthContext";

import { Outlet } from "react-router-dom";
import { useContext } from "react";


export async function loader() {
    return(null)
}


export default function Root() {
  const { user } = useContext(AuthContext);
    return (
        <>
    
          <UserHeader/>
          <main className='Main'>
            <Outlet />
          </main>
        </>
      );
    }