import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPaymentIntent, getProjectDetails, createOrder } from "@/api/client.api";
import { ProjectDetail } from "@/types/user.type";
import { useLocation } from "react-router-dom";
import { CheckCircle, ArrowBigLeft } from "lucide-react";
import { userRoutes } from "@/constants/routeUrl";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/config/stripe";
import { StripePaymentForm } from "./stripePaymentForm";


function OrderCheckout() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  
  // NEW: Payment states
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const location = useLocation();
  const { selectedPlan } = (location.state || {}) as { selectedPlan?: "basic" | "standard" | "premium" };

  useEffect(() => {
    if (projectId) {
      fetchGigDetails(projectId);
    }
  }, [projectId]);

  const fetchGigDetails = async (id: string) => {
    try {
      const res = await getProjectDetails(id);
      setProject(res.data.projectDetails.gig);
      setName(res.data.projectDetails.freelancer.name);
    } catch (error) {
      console.error("Error fetching gig:", error);
      toast.error("Failed to load project details");
    }
  };

  // Step 1: Create Payment Intent
  const handleCreatePaymentIntent = async () => {
    if (!requirements.trim()) {
      setError("Please enter requirements for the freelancer");
      toast.error("Please enter requirements for the freelancer");
      return;
    }

    try {
      setPaymentProcessing(true);
      setError(null);

      const res = await createPaymentIntent( projectId as string, project?.freelancer?.toString() as string, planPrice as number);

      if (res.success) {
        setClientSecret(res.data.clientSecret);
        toast.success("Payment form loaded. Please complete payment.");
      } else {
        setError(res.error || "Failed to create payment intent");
        toast.error(res.error || "Failed to create payment intent");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Failed to create payment intent");
      toast.error("Failed to create payment intent");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Step 2: Handle Payment Success
  const handlePaymentSuccess = async (intentId: string) => {
    try {
      setLoading(true);
      setPaymentIntentId(intentId);

      // Create order with payment confirmation
      const res = await createOrder(
        project?.freelancer?.toString() as string,
        projectId as string,
        requirements,
        selectedPlan as string,
        intentId,
        planPrice as number
      );

      if (res.success) {
        toast.success("Order placed successfully!");
        setViewModal(true);
        // Reset payment form
        setClientSecret(null);
        setOrderId(null);
        setPaymentIntentId(null);
      } else {
        setError(res.error || "Failed to create order");
        toast.error(res.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      setError("Failed to place order. Please try again.");
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
    toast.error(errorMsg);
  };

  if (!project) {
    return <p className="text-center mt-10">Loading gig details...</p>;
  }

  if (!selectedPlan) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">No plan selected. Please go back and select a plan</p>
      </div>
    );
  }

  const planPrice = project.pricing[selectedPlan]?.price;
  const planDelivery = project.pricing[selectedPlan]?.deliveryTime;

  if (!planPrice || !planDelivery) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">Invalid plan selected</p>
      </div>
    );
  }

  // Show payment form if payment intent is created
  if (clientSecret && !paymentIntentId) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-8">
        <div className="flex justify-center items-center h-20 bg-gray-100 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">Complete Your Payment</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm
                clientSecret={clientSecret}
                orderId={orderId as string}
                projectId={projectId as string}
                planPrice={planPrice}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </Elements>
          </div>

          {/* Order Summary Sidebar */}
          <div className="border rounded-lg p-6 h-fit">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{project.title}</span>
                <span className="font-semibold">₹{planPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>{planDelivery} days</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{planPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
            <button
            onClick={() => {
              setClientSecret(null);
              setOrderId(null);
            }}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <ArrowBigLeft className="inline-flex w-4 h-4 "/>Back
          </button>
        </div>
      </div>
    );
  }

  // Original checkout form
  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex justify-center items-center h-20 bg-gray-100">
        <h2 className="text-3xl font-semibold text-gray-800">Confirm Your Order</h2>
      </div>

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
          <p className="text-sm font-medium capitalize mb-2">
            <span className="bg-blue-300 text-blue-900 rounded-full px-4 p-2">{selectedPlan} Plan</span>
          </p>
          <p>
            <span className="text-green-700 font-semibold mt-2">₹{planPrice} </span> / {planDelivery} days
          </p>
        </div>
      </div>

      {/* Freelancer Section */}
      <div className="bg-gray-50 w-full h-28 rounded-lg border mb-4 flex items-center">
        <div className="p-4">
          <label className="block text-gray-700 mb-2">Freelancer</label>
          <h1 className="text-2xl font-bold capitalize">👤 {name}</h1>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Requirements for Freelancer</label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Describe your project details or special instructions..."
          rows={4}
        />
      </div>

      {/* Order Summary */}
      <div className="border w-full rounded-lg mt-10 p-4">
        <h1 className="font-bold text-lg text-gray-700 mb-4">Order Summary</h1>
        <div className="flex justify-between mb-4">
          <p className="text-lg">{project.title}</p>
          <p>₹{planPrice}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Delivery Time</p>
          <p className="text-sm">{planDelivery} days</p>
        </div>
        <div className="flex justify-between border-t-2 border-gray-300 mt-6 pt-4">
          <p className="text-lg font-bold">Total Amount</p>
          <p className="text-xl font-bold text-green-600">₹{planPrice}</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t pt-4 mt-6 flex justify-center items-center gap-4">
        <button
          className="bg-gray-800 shadow-xl font-normal text-white px-6 py-2 rounded-lg hover:bg-black disabled:bg-gray-400"
          onClick={() => navigate(`${userRoutes.PROJECT_DETAILS}/${projectId}`)}
        >
          Go Back
        </button>
        <button
          disabled={paymentProcessing || !requirements.trim()}
          onClick={handleCreatePaymentIntent}
          className="bg-gray-800 text-white px-8 py-2 rounded-lg hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
        >
          {paymentProcessing ? "Loading Payment Form..." : "Proceed to Payment"}
        </button>
      </div>

      {/* Success Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <div className="flex items-center justify-end mb-4">
              <button
                className="font-light hover:text-red-500 text-2xl"
                onClick={() => setViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full animate-bounce">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Payment has been confirmed. The freelancer will review your order soon.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-lg font-semibold text-blue-600">#{project._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-lg font-semibold text-green-600">₹{project.pricing[selectedPlan]?.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-orange-600">Awaiting Freelancer Response</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              💡 Your payment is securely held in escrow until the work is delivered and you approve it.
            </p>

            <button
              className="w-full bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
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