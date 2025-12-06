import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, ShoppingBag, Wallet, User } from "lucide-react";
import { userLogout } from "@/api/user.api";
import { useDispatch } from "react-redux";
import { removeUser } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import { useState } from "react";

function Sidebar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const links = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/freelancer-dashboard" },
    { name: "My Gigs", icon: <Briefcase size={20} />, path: "/listed-gig" },
    { name: "Orders", icon: <ShoppingBag size={20} />, path: "/listed-order" },
    { name: "Earnings", icon: <Wallet size={20} />, path: "/freelancer/earnings" },
    { name: "Profile", icon: <User size={20} />, path: "/complete-profile" },
  ];

const handleLogout = async() => {
  if (isLoggingOut) return
  
  setIsLoggingOut(true)
  try {
    const res = await userLogout()
    if(res.success){
      dispatch(removeUser())
      navigate(userRoutes.LOGOUT)
    }
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    setIsLoggingOut(false)
  }
}

  return (
    <aside className="flex flex-col bg-white w-60 p-6 border-r border-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-8 text-center hover:text-yellow-500">HireXpert</h2>

      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gray-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-300 hover:text-white"
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <button 
        className="w-full bg-red-200 text-red-600 hover:bg-red-800 hover:text-white font-medium py-2 rounded-md transition-all"
        disabled={isLoggingOut}
        onClick={handleLogout}>
        {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;