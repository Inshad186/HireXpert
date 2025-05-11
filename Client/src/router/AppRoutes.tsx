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
import Home from "@/pages/user/Home";


export const router = createBrowserRouter([
    {path : "/" , element : <LandingPage/>},
    {path : "login" , element : <Login/>},
    {path : "signUp" , element : <SignUp/>},
    {path : "otp" , element : <InputOTPDemo/>},
    {path : "forgotPassword" , element : <ForgotPassword/> },
    {element : <AppLayout/>,
        children : [
            {path : "home", element : <Home/>}
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