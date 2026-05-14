import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import Designer from "@/assets/Designer.jpg";
import Developer from "@/assets/Developer.jpg";
import Writer from "@/assets/Writer.jpg";
import VideoEditor from "@/assets/VideoEditor.jpg";
import Marketer from "@/assets/Marketer.jpg";
import VoiceArtist from "@/assets/VoiceArtist.jpg";
import Animator from "@/assets/Animator.jpg";
import toast from "react-hot-toast";
// import { completeOnboarding } from "@/api/freelancer.api";  ← not used yet — keep for later

const categories = [
  { title: "Designer",          image: Designer },
  { title: "Developer",         image: Developer },
  { title: "Writer",            image: Writer },
  { title: "Video Editor",      image: VideoEditor },
  { title: "Social Media Marketer", image: Marketer },
  { title: "Voice Artist",      image: VoiceArtist },
  { title: "Animator",          image: Animator },
];

function FreelancerOnboarding() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(userRoutes.Freelancer_Requirements);
    // Optional: toast.success("Let's build your profile! 🚀");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* ─── HERO / INTRO SECTION ─────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-20 px-5 sm:px-8 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Turn Your Skills Into Income
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Join thousands of freelancers — create your gig in minutes and start earning on your terms.
          </p>

          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-10 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]"
          >
            Become a Seller →
          </button>
        </div>
      </section>

      {/* ─── SKILLS / CATEGORIES GRID ─────────────────────────────────── */}
      <section className="px-5 sm:px-8 lg:px-12 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 md:mb-12">
            Pick Your Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={handleGetStarted} // optional: clicking card → next step
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                  <p className="text-white font-medium text-base sm:text-lg">
                    {cat.title}
                  </p>
                </div>
              </div>
            ))}

            {/* "Other" card */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-100 transition-colors duration-300 aspect-[4/3] cursor-pointer"
                 onClick={handleGetStarted}>
              <p className="text-gray-600 font-medium text-base sm:text-lg mb-3 text-center px-4">
                Your skill isn’t listed?
              </p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition"
              >
                Start Anyway →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
            How It Works in 3 Steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {[
              { img: "./src/assets/CreateGig.png",    title: "Create Your Gig",    desc: "Describe your service, set pricing, add portfolio samples" },
              { img: "./src/assets/Deliver.png",      title: "Deliver Great Work", desc: "Communicate clearly, deliver on time, exceed expectations" },
              { img: "./src/assets/Paid.png",         title: "Get Paid Securely",  desc: "Receive funds safely through our protected payment system" },
            ].map((step, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                  <img src={step.img} alt={step.title} className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{`${idx + 1}. ${step.title}`}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-yellow-50 to-amber-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
            Ready to Start Earning?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Create your first gig today — it takes less than 10 minutes.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-10 py-5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03]"
          >
            Get Started Now →
          </button>
        </div>
      </section>
    </div>
  );
}

export default FreelancerOnboarding;