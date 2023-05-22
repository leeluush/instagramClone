import UserHeader from "../compoents/UserHeader";
import SideBar from "../compoents/SideBar";
import { Outlet, useLoaderData } from "react-router-dom";


export async function loader() {
    return(null)
}


export default function Root() {
    // const {cards} = useLoaderData();
    return (
        <>
            <div className='header'>
                <SideBar />
                </div>
                <UserHeader/>
            <main className='Main'>
                <Outlet />
            </main>
        </>
    );
}