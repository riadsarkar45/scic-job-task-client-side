import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Toaster } from 'react-hot-toast';
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Components/AuthProvider';
import { useContext } from "react";
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../Components/Hooks/useAxiosPublic';

const drawerWidth = 240;


function Header_Sidebar(props) {
    const { user, logOut } = useContext(AuthContext)
    const axiosPublic = useAxiosPublic();
    console.log(user?.email)
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const { email } = useParams();
    console.log(email)
    const { data: users = [], refetch, isLoading, isError } = useQuery({
        queryKey: ['user', email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${email}`);
            return res.data;
        },
    });

    if (isLoading) {
        return <span className="loading loading-ring loading-lg"></span>;
    }

    if (isError) {
        return <span>Error loading user data</span>;
    }
    console.log(users?.fullName)
    const handleLogout = () => {
        logOut()
            .then(() => {
                navigate("/login")
            })
            .catch(error => console.error(error))
    }
    const drawer = (
        <div>


            <div className="flex flex-col bg-gray-800 h-screen overflow-hidden m-0 p-0">


                <div className=''>
                    <img className='rounded-lg h-[5rem] w-[96px] ml-7 mt-4' src={users?.image} alt="" />
                    <h2 className='text-2xl ml-4 font-serif text-white mt-4'>{users?.fullName}</h2>
                </div>
                <div className="p-4">
                    <h1 className="text-white text-2xl font-bold font-mono">My TODOS</h1>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    <ul className=" space-y-4 ml-5">
                        <li className='text-white font-mono'>
                            <NavLink to={`/dashboard/${user?.email}`}>Home</NavLink>
                        </li>
                        <li className='text-white font-mono'>
                            <NavLink to={`/dashboard/all-task/${user?.email}`}>All Task</NavLink>
                        </li>
                        <li className='text-white font-mono'>
                            <NavLink onClick={handleLogout}>LogOut</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: 'rgba(0, 40, 87, 0.7)', // Teal color with 70% opacity
                }}

            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: '#C1E7C7', // Light green color
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: 'rgba(0, 40, 87, 0.7)', // Teal color with 70% opacity
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet></Outlet>
                < Toaster />
            </Box>
        </Box>
    );
}



export default Header_Sidebar;
