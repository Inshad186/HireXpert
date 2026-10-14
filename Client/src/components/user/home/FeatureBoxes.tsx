// components/HomePageFeatures.tsx

import video1 from "@/assets/video1.mp4";
import video2 from "@/assets/video2.mp4";
import video3 from "@/assets/video3.mp4";

const FeatureBox = ({
  title,
  description,
  videoSrc,
  buttonText,
  gradient,
  reverse = false,
  textWhite = true,
}: {
  title: string;
  description: string;
  videoSrc: string;
  buttonText?: string;
  gradient: string;
  reverse?: boolean;
  textWhite?: boolean;
}) => {
  return (
    <div
      className={`
        w-full max-w-6xl mx-auto 
        rounded-2xl overflow-hidden shadow-2xl
        flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}
        items-center
        ${gradient}
      `}
    >
      {/* Text Content */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h2
          className={` text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5${textWhite ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h2>
        <p
          className={` text-lg sm:text-xl max-w-xl mb-8 ${textWhite ? "text-gray-100" : "text-gray-800"} `}
        >
          {description}
        </p>

        {buttonText && (
          <button
            className={` px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${textWhite 
                ? "bg-white text-indigo-900 hover:bg-gray-100" 
                : "bg-indigo-600 text-white hover:bg-indigo-700"}
            `}
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Video */}
      <div className="w-full lg:w-1/2 p-6 lg:p-10 flex justify-center">
        <video
          className="w-full max-w-[380px] lg:max-w-[460px] rounded-xl shadow-2xl"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default function HomePageFeatures() {
  return (
    <div className="w-full bg-gray-50 pb-20">

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* You can add subtle background pattern or video here later */}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Hire exceptional talent.<br className="hidden sm:block" />
            Build faster. Grow smarter.
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 opacity-90">
            Connect with vetted freelancers for coding, design, marketing — from quick tasks to long-term partnerships.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button className="bg-white text-indigo-900 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-100 transition transform hover:scale-105">
              Find Freelancers
            </button>
            <button className="border-2 border-white/70 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition">
              Join as Expert
            </button>
          </div>
        </div>
      </section>

      {/* ─── FEATURE BOXES ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 flex flex-col gap-16 lg:gap-24">

        <FeatureBox
          title="Need help with Vibe coding?"
          description="Get matched with the right expert to keep building and marketing your project."
          videoSrc={video1}
          buttonText="Find an expert"
          gradient="bg-gradient-to-br from-yellow-300 to-orange-600"
          textWhite={true}
        />

        <FeatureBox
          title="Bring your ideas to life with expert freelancers"
          description="HireXpert connects you with professionals who can transform your ideas into real products."
          videoSrc={video2}
          gradient="bg-gradient-to-br from-emerald-500 via-emerald-600 to-black"
          textWhite={false}
        />

        <FeatureBox
          title="Find the right talent faster"
          description="Discover skilled freelancers ready to design, develop and grow your business."
          videoSrc={video3}
          gradient="bg-gradient-to-br from-purple-700 via-purple-600 to-red-400"
          textWhite={true}
        />
      </div>

      {/* ─── FINAL CTA ─────────────────────────────────────────── */}
      <section className="mt-24 bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
            Ready to build something great?
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Find your next expert — whether it's a short task or long-term growth partner.
          </p>
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-12 py-6 rounded-xl text-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Explore Freelancers →
          </button>
        </div>
      </section>
    </div>
  );
}