import { useState } from "react";
import { RootState } from "@/redux/store";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRoutes } from "@/constants/routeUrl";
import { userLogout } from "@/api/user.api";
import { removeUser } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const PUBLIC_LINKS = [
    { name: "About Us", path: userRoutes.ABOUT_US },
    { name: "Contact Us", path: userRoutes.CONTACT_US },
  ];

  const CLIENT_LINKS = [
    { name: "Projects", path: userRoutes.PROJECTS },
    { name: "Orders", path: userRoutes.MY_ORDERS },
    { name: "Profile", path: userRoutes.PROFILE },
  ];

  const handleLogout = async () => {
    try {
      const res = await userLogout();
      if (res.success) {
        toast.success("Logout Successful");
      } else {
        console.warn("⚠️ Backend logout failed, clearing frontend anyway");
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      dispatch(removeUser());
      setMobileMenuOpen(false);
      navigate(userRoutes.LOGIN, { replace: true });
    }
  };

  const isAuthenticated = !!user._id && !!accessToken;
  const isClient = isAuthenticated && user.role === "client";

  const navLinks = isClient ? [...CLIENT_LINKS, ...PUBLIC_LINKS] : PUBLIC_LINKS;

  return (
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              H
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              Hire<span className="text-indigo-600">Xpert</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <div className="flex items-center gap-1">
              {navLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  className="text-base font-semibold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {name}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-1 pl-4 border-l border-slate-200/80 ml-2">
                {user.role && user.role !== "none" && (
                  <span className="px-2.5 py-1 rounded-full text-[13px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 mr-2">
                    {user.role}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-base font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to={userRoutes.LOGIN}
                className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-100"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2.5 rounded-xl transition-colors"
            >
              {name}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-100 mt-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2.5 rounded-xl transition-colors"
              >
                Log Out
              </button>
            ) : (
              <Link
                to={userRoutes.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;