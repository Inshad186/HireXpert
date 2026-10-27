import { Link } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import Footer from "@/components/user/common/Footer";

const STEPS = [
  { title: "Find a service", desc: "Browse gigs, compare the basic, standard, and premium plans, and choose a freelancer." },
  { title: "Pay securely", desc: "Your payment is held safely while the freelancer works on your order." },
  { title: "Review the delivery", desc: "Check the files and notes. You can ask for up to two revisions." },
  { title: "Approve and release", desc: "The freelancer is paid only after you accept the delivery." },
];

const VALUES = [
  { title: "Protected payments", desc: "Money moves to the freelancer only after the client approves the work." },
  { title: "Clear pricing", desc: "Every gig shows its price and delivery time before you order." },
  { title: "Fair for freelancers", desc: "Freelancers see the order details first, and can accept or decline it." },
];

function AboutUs() {
  return (
    <div>
      <div className="bg-slate-50/50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
              About HireXpert
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              A simple, safe place to hire freelancers
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              HireXpert connects clients with freelancers for services such as web development, design,
              and digital marketing. Our goal is to make hiring clear and payments safe for both sides.
            </p>
          </div>

          {/* How it works */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, index) => (
                <div key={step.title} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What we care about</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map((value) => (
                <div key={value.title} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
                  <h3 className="font-bold text-slate-900">{value.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to action */}
          <section className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Ready to start?</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to={userRoutes.PROJECTS}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                Browse services
              </Link>
              <Link
                to={userRoutes.CONTACT_US}
                className="px-6 py-3 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Contact us
              </Link>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;