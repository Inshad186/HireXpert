import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { assignRole } from "@/api/user.api";
import { setUser } from "@/redux/slices/userSlice";

function Home() {
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [leftClick, setLeftClick] = useState(false);
  const [rightClick, setRightClick] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  // console.log("USER >>>>>>>>>>>>> : ", user);

  useEffect(() => {
    if (user.role === "none") {
      setShowModal(true);
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

  const HandleAssignRole = async () => {
    setLoading(true);
    try {
      console.log("ROLE >>>>>>>>>>   >>>>>>>>>>  : ",role)
      const response = await assignRole(role, user.email);
      if (response.success) {
        dispatch(setUser({ role }));
        setShowModal(false);

        if (role === "freelancer") {
          navigate("/freelancer-dashboard");
        } else {
          navigate("/"); // optional, if you want to refresh home
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
    <div>
      <h1 className="text-center font-bold text-red-700"> HOME PAGE </h1>
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
    </div>
  );
}

export default Home;
