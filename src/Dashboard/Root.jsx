import { Outlet } from "react-router-dom";
import Header_Sidebar from "./Header_Sidebar";

const Root = () => {
    return (
        <div>
            <Header_Sidebar></Header_Sidebar>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;