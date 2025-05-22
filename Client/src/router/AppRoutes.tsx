//! User
import LandingPage from "@/pages/user/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/user/Login";
import SignUp from "@/pages/user/SignUp";
import { InputOTPDemo } from "@/components/user/Otp-Modal";
import ForgotPassword from "@/pages/user/ForgotPassword";
import Home from "@/pages/user/Home";
import Profile from "@/components/user/profile";
import FreelancerDashboard from "@/components/user/freelancerDashboard";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import ResetPassword from "@/components/user/resetPassword";


//! Admin
import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";



export const router = createBrowserRouter([
    {path : "login" , element : (<PublicRoute><Login/></PublicRoute>)},
    {path : "signUp" , element : (<PublicRoute><SignUp/></PublicRoute>)},
    {path : "otp" , element : (<PublicRoute><InputOTPDemo/></PublicRoute>)},
    {path : "forgotPassword" , element : (<PublicRoute><ForgotPassword/></PublicRoute>)},
    {path : "resetPassword", element : <ResetPassword/>},
    {element : <AppLayout/>,
        children : [
            {path : "/" , element : (<PublicRoute><LandingPage/></PublicRoute>)},
            {path : "home", element : (<PrivateRoute><Home/></PrivateRoute>)},
            {path : "profile" , element : (<PrivateRoute><Profile/></PrivateRoute>)},
            {path : "freelancer-dashboard", element : <FreelancerDashboard/>},
        ]
    },

    //! Admin Routes
    {path : "adminLogin", element : <AdminLogin/>},
    {element : <AppLayout/>,
        children : [
            {path : "dashboard" , element : <Dashboard/>}
        ]
    },
])