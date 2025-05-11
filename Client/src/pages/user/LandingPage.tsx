import Navbar from "@/components/user/common/Navbar";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 md:px-24 py-20 flex flex-col-reverse md:flex-row items-center justify-between bg-slate-100">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find the perfect freelance services for your business
          </h1>
          <p className="text-lg text-gray-600">
            Connect with skilled freelancers and get work done efficiently.
          </p>
          <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img
            src="./src/assets/landing.png"
            alt="Freelancer working"
            className="max-w-lg h-auto"
          />
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 px-6 md:px-24">
        <h2 className="text-3xl font-semibold mb-10">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {[
            {
              title: "Web Development",
              desc: "Build modern and responsive websites",
              icon: "💻",
            },
            {
              title: "Graphic Design",
              desc: "Create stunning visuals & branding",
              icon: "🎨",
            },
            {
              title: "Writing & Translation",
              desc: "Get high-quality written content",
              icon: "📝",
            },
            {
              title: "Digital Marketing",
              desc: "Improve your online presence and reach",
              icon: "📈",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-lg shadow hover:shadow-lg transition bg-white text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
