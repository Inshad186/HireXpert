import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { assignRole } from "@/api/user.api";
import { getProjects } from "@/api/client.api";
import { InitialProjectDetail } from "@/types/user.type";
import { setUser } from "@/redux/slices/userSlice";
import Footer from "@/components/user/common/Footer";
import { userRoutes } from "@/constants/routeUrl";
import toast from "react-hot-toast";
import { getFreelancerFullProfile } from "@/api/user.api";

function Home() {
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [leftClick, setLeftClick] = useState(false);
  const [rightClick, setRightClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState<InitialProjectDetail[]>([])
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => { 
    if (user.role === "none") {
      setTimeout(()=>{
        setShowModal(true);
      }, 1500)
    }
  }, [user.role]);

  const handleLeftClick = () => {
    setLeftClick(true);
    setRightClick(false);
    setRole("client");
  };

  const handleRightClick = () => {
    setRightClick(true);
    setLeftClick(false);
    setRole("freelancer");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        if(response.success){
          setGigs(response.data.gigs);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  const HandleAssignRole = async () => {
    setLoading(true);
    try {
      const response = await assignRole(role, user.email);
      if (response.success) {
        dispatch(setUser({ role }));
        setShowModal(false);
        toast.success(`Switched to ${role} mode`);

        if (role === "freelancer") {
          const res = await getFreelancerFullProfile()
          if(res.data.fullProfile.isSeller){
            navigate(userRoutes.FREELANCER_DASH, { replace: true });
          }else{
            navigate(userRoutes.FREELANCER_ONBOARDING, {replace: true })
          }
        } else {
          navigate(userRoutes.HOME, { replace: true }); 
        }
      } else {
        toast.error("Something went wrong during role assignment");
      }
    } catch (error) {
      console.error("Error assigning role", error);
      toast.error("Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <main className="flex-grow">
        <section className="px-6 md:px-24 py-20 flex flex-col-reverse md:flex-row items-center justify-between bg-blue-200">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find the perfect freelance services for your business
            </h1>
            <p className="text-lg text-gray-600">
              Connect with skilled freelancers and get work done efficiently.
            </p>
          </div>
          <div className="md:w-1/2 mb-10 md:mb-0">
            <img
              src="./src/assets/home.jpg"
              alt="Freelancer working"
              className="max-w-lg h-auto"
            />
          </div>
        </section>
        
        <section className="px-6 md:px-24 py-16 bg-white">
          {gigs.length > 0 && (
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide text-center md:text-left mb-10">
              <span className="border-b-4 border-indigo-500 pb-1">TOP FREELANCE SERVICES</span>
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
            {gigs.slice(0, 6).map((gig) => (
              <Link to={`${userRoutes.PROJECT_DETAILS}/${gig._id}`} key={gig._id}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={gig.gallery && gig.gallery.length > 0 ? gig.gallery[0] : "/placeholder.jpg"}
                    alt={gig.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {gig.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {gig.pricing?.basic.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-xl font-bold text-indigo-600">
                        ${gig.pricing?.basic.price}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">starting</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] md:w-[600px] text-center shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {user.name}, your account has been created!
              </h2>
              <p className="mb-6 text-gray-600">What brings you to our platform?</p>

              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div
                  className={`border-2 p-4 rounded-lg flex-1 cursor-pointer transition-all duration-200 ${
                    leftClick ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={handleLeftClick}
                >
                  <p className="font-medium text-gray-900">I am a client</p>
                  <p className="text-sm text-gray-500 mt-1">
                    I want to order freelance services.
                  </p>
                </div>

                <div
                  className={`border-2 p-4 rounded-lg flex-1 cursor-pointer transition-all duration-200 ${
                    rightClick ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={handleRightClick}
                >
                  <p className="font-medium text-gray-900">I'm a freelancer</p>
                  <p className="text-sm text-gray-500 mt-1">
                    I want to offer my services.
                  </p>
                </div>
              </div>

              <button
                onClick={HandleAssignRole}
                disabled={!role || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Saving..." : "Next"}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;