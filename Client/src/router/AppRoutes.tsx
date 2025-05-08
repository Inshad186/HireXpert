//! User
import LandingPage from "@/pages/user/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/user/Login";
import SignUp from "@/pages/user/SignUp";
import { InputOTPDemo } from "@/components/user/Otp-Modal";
import ForgotPassword from "@/pages/user/ForgotPassword";


//! Admin
import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";


export const router = createBrowserRouter([
    {path : "/" , element : <LandingPage/>},
    {path : "login" , element : <Login/>},
    {path : "signUp" , element : <SignUp/>},
    {path : "otp" , element : <InputOTPDemo/>},
    {path : "forgotPassword" , element : <ForgotPassword/> },
    {element : <AppLayout/>,
        children : []
    },

    //! Admin Routes
    {path : "adminLogin", element : <AdminLogin/>},
    {path : "dashboard", element : <Dashboard/>},
])