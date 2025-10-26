import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createOrder, getProjectDetails } from "@/api/client.api";
import { ProjectDetail } from "@/types/user.type";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";

function OrderCheckout() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation()
  const { selectedPlan } = (location.state || {}) as { selectedPlan?: "basic" | "standard" | "premium" };

  useEffect(() => {
    if (projectId){
      fetchGigDetails(projectId);
    }
  }, [projectId]);

  const fetchGigDetails = async (id: string) => {
    try {
      const res = await getProjectDetails(id);
      setProject(res.data.projectDetails.gig);
    } catch (error) {
      console.error("Error fetching gig:", error);
    }
  };

  const handlePlaceOrder = async(freelancerId: string, gigId: string, requirements:string, selectedPlan:string) => {
    try {
      setLoading(true)
      const res = await createOrder(freelancerId, gigId, requirements, selectedPlan)
      console.log("Response: ",res)
      navigate(`${userRoutes.ORDER_SUCCESS}/${projectId}`)
    } catch (error) {
      console.error("Order failed: ",error)
    }
  }

  if (!project) return <p className="text-center mt-10">Loading gig details...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Confirm Your Order
      </h2>

      {/* Gig Info Section */}
      <div className="flex gap-6 border-b pb-4 mb-4">
        <img
          src={project.gallery[0]}
          alt={project.title}
          className="w-40 h-28 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-xl font-medium">{project.title}</h3>
          <p className="text-gray-600 mb-3">{project.category}</p>
          <p className="text-gray-600 text-xl capitalize">{selectedPlan} Plan</p>
          <p><span className="text-green-700 font-semibold mt-2">₹{selectedPlan? project.pricing[selectedPlan].price : "Plan is not find"} </span> 
           / {selectedPlan ? project.pricing[selectedPlan].deliveryTime : "Plan is not find"} days
          </p>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Requirements for Freelancer
        </label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Describe your project details or special instructions..."
          rows={4}
        />
      </div>

      {/* Summary */}
      <div className="border-t pt-4 flex justify-between items-center">
        <p className="text-lg font-medium text-gray-800"> Total: ₹{project.pricing[selectedPlan!].price}
        </p>
        <button
          disabled={loading}
          onClick={() => handlePlaceOrder(
            project._id as string,
            project.freelancer as string,
            requirements as string,
            selectedPlan as string
          )}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default OrderCheckout;
