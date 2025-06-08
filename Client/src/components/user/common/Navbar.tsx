import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRoutes } from "@/constants/routeUrl";
import { userLogout } from "@/api/user.api";
import { removeUser } from "@/redux/slices/userSlice";
import { Menu, X } from "lucide-react"; 

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const pageRoutes: { [key: string]: string } = {
    "about us": userRoutes.ABOUT,
    "contact us": userRoutes.CONTACT,
    "profile": userRoutes.PROFILE,
    "services": userRoutes.SERVICES,
  };

  const handleLogout = async () => {
    const res = await userLogout();
    if (res.success) {
      dispatch(removeUser());
      navigate(userRoutes.LOGIN);
    } else {
      console.error("Logout failed:", res.error);
    }
  };

  return (
    <nav className="bg-white shadow-2xl py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="text-3xl font-bold text-gray tracking-wide">
          HireXpert
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4 items-center">
          {user.accessToken ? (
            <>
              {Object.entries(pageRoutes).map(([name, route]) => (
                <button
                  key={name}
                  className="text-black text-lg font-semibold px-4 py-2 rounded-xl hover:bg-gray-300"
                  onClick={() => navigate(route)}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="text-red-700 text-lg font-semibold px-6 py-2 rounded-xl"
              >
                Log Out
              </button>
            </>
          ) : (
            <div
              className="bg-black text-white text-lg font-semibold px-6 py-2 rounded-xl cursor-pointer"
              onClick={() => navigate(userRoutes.LOGIN)}
            >
              Log In
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 mt-4 space-y-3">
          {user.accessToken ? (
            <>
              {Object.entries(pageRoutes).map(([name, route]) => (
                <button
                  key={name}
                  className="block w-full text-left text-black text-lg font-semibold px-4 py-2 rounded-xl hover:bg-gray-300"
                  onClick={() => {
                    navigate(route);
                    setMenuOpen(false);
                  }}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left text-red-700 text-lg font-semibold px-6 py-2 rounded-xl"
              >
                Log Out
              </button>
            </>
          ) : (
            <div
              className="bg-black text-white text-lg font-semibold px-6 py-2 rounded-xl cursor-pointer"
              onClick={() => {
                navigate(userRoutes.LOGIN);
                setMenuOpen(false);
              }}
            >
              Log In
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
