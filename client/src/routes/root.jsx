import UserHeader from "../compoents/UserHeader";

import { AuthContext } from "../compoents/AuthContext"
import SideBar from "../compoents/SideBar";
import { Outlet, useLoaderData } from "react-router-dom";
import { useContext } from "react";


export async function loader() {
    return(null)
}


export default function Root() {
    const { user } = useContext(AuthContext); 
    // const {cards} = useLoaderData();
    return (
        <>
          <UserHeader/>
          <main className='Main'>
            <Outlet />
          </main>
        </>
      );
    }