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
import { Role } from "@/types/user.type";
import FeatureBoxes from "@/components/user/home/FeatureBoxes";

function Home() { 

  const [role, setRole] = useState<Role>("");
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

  const handleAssignRole = async () => {
    setLoading(true);
    try {
      const response = await assignRole(role, user.email);
      if (response.success) {
        dispatch(setUser({...user, role }));
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
{/* ─── HERO SECTION ──────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-36 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-3/5 space-y-7 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Hire top talent.<br className="hidden sm:block" />
                Get your project done — fast.
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
                Connect with skilled freelancers for design, development, marketing, and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4">
                <Link
                  to={userRoutes.PROJECTS || "/projects"}
                  className="bg-white text-indigo-900 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-100 transition transform hover:scale-105"
                >
                  Browse Services
                </Link>
                <Link
                  to={userRoutes.FREELANCER_ONBOARDING || "/become-freelancer"}
                  className="border-2 border-white/70 px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition"
                >
                  Become a Freelancer
                </Link>
              </div>
            </div>

            <div className="md:w-2/5 flex justify-center">
              <img
                src="./src/assets/home.jpg"
                alt="Freelance collaboration"
                className="max-w-md lg:max-w-lg h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </section>
        
        {/* ─── FEATURED SERVICES ─────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            {gigs.length > 0 && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Popular Services
                <span className="block w-20 h-1 bg-indigo-500 mx-auto mt-4 rounded"></span>
              </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {gigs.slice(0, 6).map((gig) => (
                <Link
                  key={gig._id}
                  to={`${userRoutes.PROJECT_DETAILS}/${gig._id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={gig.gallery?.[0] ?? "/placeholder.jpg"}
                      alt={gig.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">
                      {gig.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 min-h-[3rem]">
                      {gig.pricing?.basic?.description || "Professional service"}
                    </p>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-xl font-bold text-indigo-600">
                        ${gig.pricing?.basic?.price ?? "?"}
                      </span>
                      <span className="text-gray-500 text-sm ml-1.5">starting</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {gigs.length === 0 && (
              <p className="text-center text-gray-500 py-12">
                Loading popular services...
              </p>
            )}
          </div>
        </section>

        <FeatureBoxes/>

{/* ─── ROLE SELECTION MODAL ─────────────────────────────── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl p-8 md:p-10 w-full max-w-lg shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                Welcome, {user.name}!
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Choose how you'd like to use the platform
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <button
                  type="button"
                  onClick={handleLeftClick}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${
                    leftClick
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-lg text-gray-900">I'm a Client</div>
                  <div className="text-sm text-gray-600 mt-1">
                    I want to hire freelancers
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleRightClick}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${
                    rightClick
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-lg text-gray-900">I'm a Freelancer</div>
                  <div className="text-sm text-gray-600 mt-1">
                    I want to offer services
                  </div>
                </button>
              </div>

              <button
                onClick={handleAssignRole}
                disabled={!role || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Saving..." : "Continue →"}
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