import LandingPage from "../pages/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/Login";
import {Signup} from "@/pages/SignUp"

export const router = createBrowserRouter([
    {path : "/" , element : <LandingPage/>},
    {path : "login" , element : <Login/>},
    {path : "signUp" , element : <Signup/>},
    {element : <AppLayout/>,
        children : []
    }
])