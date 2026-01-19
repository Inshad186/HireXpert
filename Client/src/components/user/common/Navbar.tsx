import { RootState } from "@/redux/store";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRoutes } from "@/constants/routeUrl";
import { userLogout } from "@/api/user.api";
import { removeUser } from "@/redux/slices/userSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const pageRoutes = {
    "about us": userRoutes.ABOUT,
    "contact us": userRoutes.CONTACT,
  };

  const clientRoutes = {
    "projects" : userRoutes.PROJECTS,
    "orders" : userRoutes.MY_ORDERS,
    "profile" : userRoutes.PROFILE
  }

  const freelancerRoutes = {
    "my gigs" : userRoutes.LISTED_GIG,
    "create gig" : userRoutes.CREATE_GIG,
    "orders" : "",
    "profile" : userRoutes.PROFILE
  }

  const handleLogout = async () => {
    const res = await userLogout();
    if (res.success) {
      dispatch(removeUser());
      navigate(userRoutes.LOGIN);
    } else {
      console.error("Logout failed:", res.error);
    }
  };

  let navRoutes:Record<string, string> = {}

  if(user?.accessToken){
    if(user.role === "client"){
      navRoutes = clientRoutes;
    }else if(user.role === "freelancer"){
      navRoutes = freelancerRoutes;
    }else{
      navRoutes = pageRoutes
    }
  }

  return (
    <nav className="bg-white shadow-2xl py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="text-3xl font-bold text-gray tracking-wide">
          <Link
          to={"/"}>
          HireXpert
          </Link>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          {user.accessToken ? (
            <>
            {Object.entries(navRoutes).map(([name,route]) => (
              <Link
              key={name}
              to={route}
              className="text-black text-lg font-semibold px-4 py-2 rounded-xl hover:bg-gray-300"
              >
              {name[0].toUpperCase() + name.slice(1)}
              </Link>
            ))}
              <button
                onClick={handleLogout}
                className="text-red-700 text-lg font-semibold px-6 py-2 rounded-xl"
              >
                Log Out
              </button>
            </>
          ) : (
            <div>
              <Link
              to={userRoutes.LOGIN}
              className="bg-black text-white text-lg font-semibold px-6 py-2 rounded-xl cursor-pointer"
              >
              Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
