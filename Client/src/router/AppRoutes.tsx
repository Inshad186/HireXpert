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

//! Admin
import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";


export const router = createBrowserRouter([
    {path : "login" , element : <Login/>},
    {path : "signUp" , element : <SignUp/>},
    {path : "otp" , element : <InputOTPDemo/>},
    {path : "forgotPassword" , element : <ForgotPassword/>},
    {element : <AppLayout/>,
        children : [
            {path : "/" , element : <LandingPage/>},
            {path : "home", element : <Home/>},
            {path : "profile" , element : <Profile/>},
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