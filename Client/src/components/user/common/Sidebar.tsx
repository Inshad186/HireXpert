import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { LayoutDashboard, Briefcase, ShoppingBag, Wallet, User } from "lucide-react";
import toast from "react-hot-toast";
import { userLogout } from "@/api/user.api";
import { removeUser } from "@/redux/slices/userSlice";
import { userRoutes } from "@/constants/routeUrl";

const LINKS = [
  { name: "Dashboard", icon: LayoutDashboard, path: userRoutes.FREELANCER_DASH },
  { name: "My Gigs", icon: Briefcase, path: userRoutes.LISTED_GIG },
  { name: "Orders", icon: ShoppingBag, path: userRoutes.LISTED_ORDER },
  { name: "Earnings", icon: Wallet, path: userRoutes.FREELANCER_EARNINGS },
  { name: "Profile", icon: User, path: userRoutes.COMPLETE_PROFILE },
];

function FreelancerSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const res = await userLogout();
      if (res.success) toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userData");
      dispatch(removeUser());
      navigate(userRoutes.LOGIN, { replace: true });
    }
  };

  return (
    <aside className="flex flex-col bg-white w-60 p-6 border-r border-gray-200 shadow-lg">
      <Link to={userRoutes.FREELANCER_DASH} className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
          H
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
          Hire<span className="text-indigo-600">Xpert</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-3" aria-label="Freelancer menu">
        {LINKS.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
              }`
            }
          >
            <Icon size={20} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-red-200 text-red-600 hover:bg-red-800 hover:text-white disabled:opacity-60 font-medium py-2 rounded-md transition-all"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default FreelancerSidebar;