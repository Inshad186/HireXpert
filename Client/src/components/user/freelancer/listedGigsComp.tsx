import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import { ProjectDetail } from "@/types/user.type";

interface ListedGigsCompProps {
  list: ProjectDetail[];
  loading: boolean;
  error: string | null;
  onToggle: (id: string, currentStatus: boolean) => Promise<void>;
}

function ListedGigsComp({ list, loading, error, onToggle }: ListedGigsCompProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "standard" | "premium">("basic");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center text-gray-600 py-20">
            <p className="text-lg font-medium">Loading gigs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center text-red-600 py-20">
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Gigs</h1>
          <button
            onClick={() => navigate(userRoutes.FREELANCER_DASH)}
            className="bg-gray-800 hover:bg-gray-900 transition-colors text-white font-medium px-4 py-2 rounded-lg shadow"
          >
            Back to Dashboard
          </button>
        </div>

        {list.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            <p className="text-lg font-medium mb-3">No gigs found yet.</p>
            <button
              onClick={() => navigate(userRoutes.CREATE_GIG)}
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg"
            >
              Create Your First Gig
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white text-sm uppercase tracking-wider">
                  <th className="p-4">#</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Delivery Time</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((gig, index) => (
                  <tr
                    key={gig._id}
                    className="border-t border-gray-200 hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-4 font-medium text-gray-700">{index + 1}</td>
                    <td className="p-4 text-gray-700">{gig.title || "—"}</td>
                    <td className="p-4 text-gray-600">{gig.category || "—"}</td>
                    <td className="p-4 capitalize text-gray-600">{selectedPlan}</td>
                    <td className="p-4 text-gray-600">
                      {gig.pricing?.basic?.deliveryTime || 0} days
                    </td>
                    <td className="p-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={gig.isActive}
                          onChange={() => onToggle(gig?._id || "", gig?.isActive ?? false)}
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-center mt-6">
          <button 
          className="text-white bg-gray-900 px-4 py-2 rounded-md font-medium"
          onClick={() => navigate(userRoutes.CREATE_GIG)}> 
            Create Gig
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListedGigsComp;