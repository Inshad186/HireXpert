import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";

function RequirementComp() {

    const navigate = useNavigate()

  return (
    <div className="bg-white text-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
          Become a Seller on HireXpert
        </h1>

        <p className="text-gray-300 mb-8 text-center">
          To start selling your services, please complete the steps below.
        </p>

        <ul className="space-y-4 text-gray-200 text-sm md:text-base">
          <li className="flex items-start gap-3">
            <span className="text-green-400 font-bold">✓</span>
            Upload a clear profile picture
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 font-bold">✓</span>
            Complete your freelancer profile (bio, experience, etc.)
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 font-bold">✓</span>
            Select your working days and hours
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 font-bold">✓</span>
            Add your portfolio (if available)
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 font-bold">✓</span>
            Choose your skills and categories
          </li>
        </ul>

        <div className="mt-10 flex justify-center">
          <button
          onClick={() => {
            navigate(userRoutes.COMPLETE_PROFILE)
          }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequirementComp;

