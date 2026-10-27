import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { userRoutes } from "@/constants/routeUrl";
import Footer from "@/components/user/common/Footer";
import landingImage from "@/assets/landing.png";

const CATEGORIES = [
  { title: "Web Development", desc: "Build modern and responsive websites", icon: "💻" },
  { title: "UI/UX Design", desc: "Design clear and friendly interfaces", icon: "🧩" },
  { title: "Graphic Design", desc: "Create stunning visuals and branding", icon: "🎨" },
  { title: "Digital Marketing", desc: "Improve your online presence and reach", icon: "📈" },
  { title: "Video Editing", desc: "Turn raw footage into polished videos", icon: "🎬" },
];

const STEPS = [
  { title: "Choose a service", desc: "Browse gigs, compare plans, and pick the freelancer you like." },
  { title: "Pay securely", desc: "Your payment is held safely while the freelancer works." },
  { title: "Approve and release", desc: "The freelancer is paid only after you accept the delivery." },
];

function LandingPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isLoggedIn = !!user._id && !!accessToken;

  const handleGetStarted = () => {
    navigate(isLoggedIn ? userRoutes.HOME : userRoutes.LOGIN);
  };

  const handleCategory = (category: string) => {
    navigate(
      isLoggedIn
        ? `${userRoutes.PROJECTS}?category=${encodeURIComponent(category)}`
        : userRoutes.LOGIN
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="px-6 md:px-24 py-20 flex flex-col-reverse md:flex-row items-center justify-between bg-slate-100">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find the perfect freelance services for your business
          </h1>
          <p className="text-lg text-gray-600">
            Connect with skilled freelancers and get work done efficiently.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {isLoggedIn ? "Go to Home" : "Get Started"}
          </button>
        </div>
        <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
          <img src={landingImage} alt="Freelancer working" className="w-full max-w-lg h-auto" />
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 px-6 md:px-24">
        <h2 className="text-3xl font-semibold mb-10">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((item) => (
            <button
              key={item.title}
              onClick={() => handleCategory(item.title)}
              className="p-6 rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition bg-white text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 md:px-24 bg-slate-50">
        <h2 className="text-3xl font-semibold mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STEPS.map((step, index) => (
            <div key={step.title} className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                {index + 1}
              </div>
              <h3 className="font-bold text-lg">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;