//! User
import LandingPage from "@/pages/user/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/user/auth/Login";
import SignUp from "@/pages/user/auth/SignUp";
import Otp from "@/pages/user/auth/Otp";
import ForgotPassword from "@/pages/user/auth/ForgotPassword";
import Home from "@/pages/user/Home";
import Profile from "@/pages/user/Profile";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import ResetPassword from "@/pages/user/auth/ResetPassword";
import Projects from "@/pages/user/Projects";
import ProjectDetail from "@/pages/user/ProjectDetail";
import OrderCheckoutPage from "@/pages/user/OrderCheckout";
import NotFoundPage from "@/pages/user/NotFoundPage";
import ContactUs from "@/pages/user/ContactUs";
import AboutUs from "@/pages/user/AboutUs";


//! Freelancer
import FreelancerRequirements from "@/pages/user/FreelancerRequirements";
import CompleteFreelancerProfile from "@/pages/user/CompleteFreelancerProfile";
import Gig from "@/pages/user/Gig";
import ListedGig from "@/pages/user/ListedGig";
import FreelancerOnboardingPage from "@/pages/user/FreelancerOnboardingPage";
import FreelancerDashboardPage from "@/pages/user/FreelancerDashboardPage";
import ListedOrder from "@/pages/user/ListedOrder";
import EarningsCards from "@/pages/user/EarningCards";


//! Admin
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import ClientListPage from "@/pages/admin/ClientManagement";
import FreelancerListPage from "@/pages/admin/FreelancerManagement";
import SkillManagement from "@/pages/admin/SkillManagement";
import OrderPage from "@/pages/admin/OrderPage";
import MyOrdersPage from "@/pages/user/myOrdersPage";



export const router = createBrowserRouter([
  //! Auth routes (public)
  {path: "login", element: <PublicRoute><Login/></PublicRoute>},
  {path: "signup", element: <PublicRoute><SignUp/></PublicRoute>},
  {path: "otp", element: <PublicRoute><Otp/></PublicRoute>},
  {path: "forgotPassword", element: <PublicRoute><ForgotPassword/></PublicRoute>},
  {path: "resetPassword", element: <PublicRoute><ResetPassword/></PublicRoute>},

  //! Freelancer onboarding
  {path: "freelancer-requirements", element: <PrivateRoute><FreelancerRequirements/></PrivateRoute>},
  {path: "complete-profile", element: <PrivateRoute><CompleteFreelancerProfile/></PrivateRoute>},
  {path: "create-gig", element: <PrivateRoute><Gig/></PrivateRoute>},
  {path: "listed-gig", element: <PrivateRoute><ListedGig/></PrivateRoute>},
  {path: "listed-order", element: <PrivateRoute><ListedOrder/></PrivateRoute>},
  {path: "freelancer-dashboard", element: <PrivateRoute><FreelancerDashboardPage/></PrivateRoute>},
  {path: "freelancer-onboarding", element: <PrivateRoute><FreelancerOnboardingPage/></PrivateRoute>},
  {path: "freelancer-earnings", element: <PrivateRoute><EarningsCards/></PrivateRoute>},

  //! Main app
  {element: <AppLayout/>,
    children: [
      {path: "/", element: <PublicRoute><LandingPage/></PublicRoute>},
      {path: "home", element: <PrivateRoute><Home/></PrivateRoute>},
      {path: "profile", element: <PrivateRoute><Profile/></PrivateRoute>},
      {path: "projects", element: <PrivateRoute><Projects/></PrivateRoute>},
      {path: "project-detail/:projectId", element: <PrivateRoute><ProjectDetail/></PrivateRoute>},
      {path: "order-checkout/:projectId", element: <PrivateRoute><OrderCheckoutPage/></PrivateRoute>},
      {path: "my-orders", element: <PrivateRoute><MyOrdersPage/></PrivateRoute>},
    ]
  },

  //! Admin
  {path: "admin-login", element: <AdminLogin/>},
  {path: "admin", element: <AdminLayout/>,
    children: [
      {path: "", element: <Dashboard/>},
      {path: "dashboard", element: <Dashboard/>},
      {path: "clients", element: <ClientListPage/>},
      {path: "freelancers", element: <FreelancerListPage/>},
      {path: "skills", element: <SkillManagement/>},
      {path: "orders", element: <OrderPage/>},
    ]
  },

  //! Open Pages
  {element: <AppLayout/>,
    children: [
      {path: "/contact", element: <ContactUs/>},
      {path: "/about", element: <AboutUs/>},
    ]
  },

  //! 404
  {path: "*", element: <NotFoundPage/>},
])