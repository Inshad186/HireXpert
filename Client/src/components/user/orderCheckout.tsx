import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createOrder, getProjectDetails } from "@/api/client.api";
import { ProjectDetail } from "@/types/user.type";
import { useLocation } from "react-router-dom";
import { CheckCircle} from "lucide-react";
import { userRoutes } from "@/constants/routeUrl";
import toast from "react-hot-toast";

function OrderCheckout() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
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
      setName(res.data.projectDetails.freelancer.name)
    } catch (error) {
      console.error("Error fetching gig:", error);
    }
  };

  const handlePlaceOrder = async(freelancerId: string, gigId: string, requirements:string, selectedPlan:string) => {
    if(!requirements.trim()){
      setError("Please enter requirements for the freelancer")
      toast.error("Please enter requirements for the freelancer")
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await createOrder(freelancerId, gigId, requirements, selectedPlan)
    } catch (error) {
      console.error("Order failed: ",error)
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!project) return <p className="text-center mt-10">Loading gig details...</p>;

  if(!selectedPlan) {
    return(
      <div className="text-center mt-10">
        <p className="text-red-600">No plan selected. Please go back and select a plan</p>
      </div>
    )
  }

  const planPrice = project.pricing[selectedPlan]?.price
  const planDelivery = project.pricing[selectedPlan]?.deliveryTime

  if(!planPrice || !planDelivery){
    return(
      <div className="text-center mt-10">
        <p className="text-red-600">Invalid plan selected</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4 bg-gray-100 text-center">
        Confirm Your Order
      </h2>

      {/* Gig Info Section */}
      <div className="flex gap-6 border-b pb-4 mt-8 mb-4">
        <img
          src={project.gallery[0]}
          alt={project.title}
          className="w-40 h-28 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-xl font-medium">{project.title}</h3>
          <p className="text-gray-600 mb-3">{project.category}</p>
          <p className="text-sm font-medium capitalize mb-2"><span className="bg-blue-300 text-blue-900 rounded-full px-4 p-2">{selectedPlan} Plan</span></p>
          <p><span className="text-green-700 font-semibold mt-2">₹{selectedPlan? planPrice : "Plan is not find"} </span> 
           / {selectedPlan ? planDelivery : "Plan is not find"} days
          </p>
        </div>
      </div>

      {/* freelancer */}
      <div className="bg-gray-50 w-full h-28 rounded-lg border mb-4">
        <label className="block text-gray-700 mb-2 p-4">
          Freelancer
          <h1 className="text-2xl font-bold capitalize mt-2">👤{name}</h1>
          </label>
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

      {/* Order Summary */}
      <div className="border w-full h-56 rounded-lg mt-10">
        <h1 className="font-bold text-lg p-4 text-gray-700">Order Summary</h1>
        <div className="flex justify-between mb-4">
          <p className="px-6 text-lg">{project.title}</p>
          <p className="px-6">{selectedPlan? planPrice : "Plan is not find"}</p>
        </div>
        <div className="flex justify-between">
          <p className="px-6 text-sm">Delivery Time</p>
          <p className="px-6 text-sm">{selectedPlan? planDelivery : "Plan is not find"} days</p>
        </div>
        <div className="flex justify-between border-t-2 border-gray-300 mt-10">
          <p className="px-6 text-lg font-bold mt-4">Total Amount</p>
          <p className="px-6 text-xl font-bold text-green-600 mt-4">₹{selectedPlan? planPrice : "Plan is not find"}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t pt-4 flex justify-center items-center gap-2">
        <button
        className="bg-gray-800 shadow-xl font-normal text-white px-6 py-2 rounded-lg hover:bg-black disabled:bg-gray-400"
        onClick={() => navigate(`${userRoutes.PROJECT_DETAILS}/${projectId}`)}
        >Go back</button>
        <button
          disabled={loading}
          onClick={() => {
            handlePlaceOrder(
            project._id?.toString() as string,
            project.freelancer?.toString() as string,
            requirements as string,
            selectedPlan
          );
          {requirements && (
            setViewModal(true)
          )}}}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black disabled:bg-gray-400"
        >
          {loading ? "Processing Order..." : "Place Order"}
        </button>
      </div>


      {/* Modal */}
      {viewModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been created successfully. The freelancer will review it soon.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="mb-3">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg font-semibold text-blue-600">#{projectId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-lg font-semibold text-green-600">₹{planPrice}</p>
            </div>
          </div>

          <button
            className="w-full bg-white border text-black font-medium px-6 py-3 rounded-lg hover:bg-gray-400 hover:text-white transition"
            onClick={() => navigate(userRoutes.MY_ORDERS)}
          >
            View My Orders
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default OrderCheckout;
