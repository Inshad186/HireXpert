import { useState, useEffect } from "react";
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
  const [gigs, setGigs] = useState<InitialProjectDetail[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => { 
    if (user.role === "none") {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500);
      return () => clearTimeout(timer);
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
        if (response.success) {
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
        dispatch(setUser({ ...user, role }));
        setShowModal(false);
        toast.success(`Switched to ${role} mode`);

        if (role === "freelancer") {
          const res = await getFreelancerFullProfile();
          if (res.data.fullProfile.isSeller) {
            navigate(userRoutes.FREELANCER_DASH, { replace: true });
          } else {
            navigate(userRoutes.FREELANCER_ONBOARDING, { replace: true });
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
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col">
      <main className="flex-grow">
        {/* ─── HERO SECTION ──────────────────────────────────────── */}
        <section className="relative bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-20 lg:py-28 px-6">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-3/5 space-y-6 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                Modern Freelance Marketplace
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Hire top talent. <br className="hidden sm:block" />
                Get your project done — fast.
              </h1>
              <p className="text-base sm:text-lg text-indigo-200 max-w-2xl font-normal leading-relaxed">
                Connect with verified freelancers across web development, UI/UX design, marketing, and creative production.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Link
                  to={userRoutes.PROJECTS || "/projects"}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md transition-colors text-center"
                >
                  Browse Services
                </Link>
                <Link
                  to={userRoutes.FREELANCER_ONBOARDING || "/become-freelancer"}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold text-sm backdrop-blur-md transition-colors text-center"
                >
                  Become a Freelancer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURED SERVICES ─────────────────────────────────── */}
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular Services
              </h2>
              <p className="text-md text-slate-500 mt-1">
                Explore handpicked offerings from top freelancers
              </p>
            </div>
            {gigs.length > 0 && (
              <Link
                to={userRoutes.PROJECTS || "/projects"}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                View all services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {gigs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.slice(0, 6).map((gig) => (
                <Link
                  key={gig._id}
                  to={`${userRoutes.PROJECT_DETAILS}/${gig._id}`}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={gig.gallery?.[0] ?? "/placeholder.jpg"}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                    />
                    {gig.pricing?.basic?.price && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200/50">
                        <span className="text-xs text-slate-500 font-medium">From </span>
                        <span className="text-sm font-bold text-indigo-600">
                          ₹{gig.pricing.basic.price}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {gig.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {gig.pricing?.basic?.description || "Professional freelance service"}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors flex items-center gap-0.5">
                        View details
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-sm font-medium text-slate-400">Loading popular services...</p>
            </div>
          )}
        </section>

        <FeatureBoxes />

        {/* ─── ROLE SELECTION MODAL ─────────────────────────────── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-100 space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Welcome, {user.name}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select your primary role to customize your experience
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleLeftClick}
                  className={`p-5 rounded-xl border text-left transition-colors ${
                    leftClick
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">I'm a Client</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Looking to hire talent and manage projects
                  </p>
                </button>

                <button
                  type="button"
                  onClick={handleRightClick}
                  className={`p-5 rounded-xl border text-left transition-colors ${
                    rightClick
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">I'm a Freelancer</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Looking to offer services and complete gigs
                  </p>
                </button>
              </div>

              <button
                onClick={handleAssignRole}
                disabled={!role || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Saving..." : "Continue"}
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