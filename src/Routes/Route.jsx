import { createBrowserRouter } from "react-router-dom";
import Home from "../Dashboard/Pages/Home";
import Header_Sidebar from "../Dashboard/Header_Sidebar";
import AllTasks from "../Dashboard/Pages/AllTasks";
import Login from "../Public/Login";
import SignUp from "../Public/SignUp";
import Root from "../Public/Root";
import HomeContent from "../Public/Pages/HomeContent";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        children: [
            {
                path: "/",
                element: <HomeContent></HomeContent>
            }
        ]
    },
    {
        path: "/login",
        element: <Login></Login>
    },
    {
        path: "/sign-up",
        element: <SignUp></SignUp>
    },
    {
        path: "dashboard",
        element: <Header_Sidebar></Header_Sidebar>,
        children: [
            {
                path: "/dashboard/:email",
                element: <Home></Home>,
            },
            {
                path: "/dashboard/all-task/:email",
                element: <AllTasks></AllTasks>
            }
        ]
    }
])

export default Router