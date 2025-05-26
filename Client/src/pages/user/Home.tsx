import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { assignRole, getFreelancer } from "@/api/user.api";
import { setUser } from "@/redux/slices/userSlice";
import Footer from "@/components/user/common/Footer";

function Home() {
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [leftClick, setLeftClick] = useState(false);
  const [rightClick, setRightClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [freelancers, setFreelancers] = useState<{ name: string; email: string; profession: string; work_experience: string; working_days: string; active_hours: string; profilePicture: string }[]>([]);

  console.log("Freelancers %% ",freelancers)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  const isClient = user.role
  const isFreelancer = user.role

  useEffect(() => {
    if (user.role === "none") {
      setTimeout(()=>{
        setShowModal(true);
      },1500)
    }else{
      setShowModal(false)
    }
  }, []);

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
  const fetchFreelancers = async () => {
    try {
      const response = await getFreelancer();
      if(response.success){
        setFreelancers(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch freelancers", err);
    }
  };

  fetchFreelancers();
}, []);

  const HandleAssignRole = async () => {
    setLoading(true);
    try {
      const response = await assignRole(role, user.email);
      if (response.success) {
        dispatch(setUser({ role }));
        setShowModal(false);

        if (role === "freelancer") {
          navigate("/freelancer-dashboard");
        } else {
          navigate("/home"); 
        }
      } else {
        console.log("Something went wrong during role assignment.");
      }
    } catch (error) {
      console.error("Error assigning role", error);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-white text-gray-800">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6  max-w-screen-xl mx-auto mt-6">
        {freelancers.map((freelancer, index) => (
          <div key={index} className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={freelancer.profilePicture}
              alt={freelancer.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{freelancer.name}</h3>
              <p className="text-gray-600">{freelancer.profession}</p>
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p><strong>Experience:</strong> {freelancer.work_experience}</p>
                <p><strong>Working Days:</strong> {freelancer.working_days}</p>
                <p><strong>Active Hours:</strong> {freelancer.active_hours}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {user.name}, your account has been created!
            </h2>
            <p className="mb-4">What brings you to our platform?</p>

            <div className="flex justify-between mb-4">
              <div
                className={`border p-4 rounded-lg w-[48%] cursor-pointer ${
                  leftClick ? "border-blue-500 bg-blue-100" : "border-gray-300"
                }`}
                onClick={handleLeftClick}
              >
                <p className="font-medium">I am a client</p>
                <p className="text-sm text-gray-500">
                  I want to order freelance services.
                </p>
              </div>

              <div
                className={`border p-4 rounded-lg w-[48%] cursor-pointer ${
                  rightClick ? "border-blue-500 bg-blue-100" : "border-gray-300"
                }`}
                onClick={handleRightClick}
              >
                <p className="font-medium">I'm a freelancer</p>
                <p className="text-sm text-gray-500">
                  I want to offer my services.
                </p>
              </div>
            </div>

            <button
              onClick={HandleAssignRole}
              disabled={!role || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
