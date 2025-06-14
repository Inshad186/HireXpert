//! User
import LandingPage from "@/pages/user/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/user/Login";
import SignUp from "@/pages/user/SignUp";
import { InputOTPDemo } from "@/components/user/Otp-Modal";
import ForgotPassword from "@/pages/user/ForgotPassword";
import Home from "@/pages/user/Home";
import Profile from "@/components/user/profile/Profile";
import FreelancerDashboard from "@/components/user/freelancerDashboard";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import ResetPassword from "@/components/user/resetPassword";
import Services from "@/pages/user/Services";


//! Admin
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import UserManagement from "@/pages/admin/UserManagement";
import SkillManagement from "@/pages/admin/SkillManagement";


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
            {path : "services", element : <Services/>},
        ]
    },

    //! Admin Routes
    {path : "adminLogin", element : <AdminLogin/>},
    {path : "admin", element : <AdminLayout/>,
        children : [
            {path : "dashboard" , element : <Dashboard/>},
            {path : "userManagement" , element : <UserManagement/>},
            {path : "skillManagement" , element : <SkillManagement/>},
        ]
    },
])