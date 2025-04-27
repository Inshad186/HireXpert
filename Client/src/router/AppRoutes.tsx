import LandingPage from "../pages/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/Login";
import {Signup} from "@/pages/SignUp"
import { InputOTPDemo } from "@/components/user/Otp-Modal";
import ForgotPassword from "@/pages/ForgotPassword";


export const router = createBrowserRouter([
    {path : "/" , element : <LandingPage/>},
    {path : "login" , element : <Login/>},
    {path : "signUp" , element : <Signup/>},
    {path : "otp" , element : <InputOTPDemo/>},
    {path : "forgotPassword" , element : <ForgotPassword/> },
    {element : <AppLayout/>,
        children : []
    }
])