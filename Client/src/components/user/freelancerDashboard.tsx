import { useNavigate } from "react-router-dom";

const skills = [
  { title: "I am a Designer", image: "./src/assets/Designer.jpg" },
  { title: "I am Developer", image: "./src/assets/Developer.jpg" },
  { title: "I am a Writer", image: "./src/assets/Writer.jpg" },
  { title: "I am a Video Editor", image: "./src/assets/VideoEditor.jpg" },
  { title: "I am a Social Media Marketer", image: "./src/assets/Marketer.jpg" },
  { title: "I am a Voice Artist", image: "./src/assets/VoiceArtist.jpg" },
  { title: "I am a Animator", image: "./src/assets/Animator.jpg" },
];

function FreelancerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-center px-4 py-10">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        Work Your Way
      </h1>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md mb-10"
        onClick={() => navigate("/signup")}
      >
        Become a seller
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
        {skills.map((skill, idx) => (
          <div key={idx} className="relative rounded-lg overflow-hidden shadow-lg">
            <img src={skill.image} alt={skill.title} className="w-full h-48 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-sm p-2">
              {skill.title}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center border border-dashed border-gray-400 rounded-lg h-48 flex-col bg-white">
          <p className="text-sm font-medium mb-2">What is your skill?</p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
          >
            Become a seller
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-gray-700 mb-16">
        <h2 className="text-2xl font-semibold mb-6">How it Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <img src="./src/assets/CreateGig.png" alt="Create a Gig" className="mx-auto mb-2 h-12" />
            <p>1. Create a Gig</p>
          </div>
          <div>
            <img src="./src/assets/Deliver.png" alt="Deliver work" className="mx-auto mb-2 h-12" />
            <p>2. Deliver great works</p>
          </div>
          <div>
            <img src="./src/assets/Paid.png" alt="Get paid" className="mx-auto mb-2 h-12" />
            <p>3. Get paid</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-6">
        <p className="mb-4 font-medium text-lg">Sign up & create your first gig today</p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
