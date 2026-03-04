import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import { useEffect, useState } from "react";
import { getOrderList } from "@/api/freelancer.api";
import { OrderDetail } from "@/types/user.type";
import OrderModal from "./orderModal";
// import { useMessaging } from "@/hooks/useMessaging";
import { useMessagingContext } from "@/context/messagingContext";
import { MessageSquare } from "lucide-react";
import { ChatModal } from "../chatModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function ListedOrdersComp() {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState<OrderDetail[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false)

  const freelancerId = useSelector((state: RootState) => state.user._id)
  const freelancerName = useSelector((state: RootState) => state.user.name)
  const {isConnected, isTyping, messages, sendMessage, markAsRead} = useMessagingContext()

  const currentUserId = freelancerId
  const currentUserName = freelancerName
  

  useEffect(() => {
    const trackingOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getOrderList();
        if (response.success) {
          setOrdersList(response.data.orderDetails);
          setLocalError(null);
        } else {
          setLocalError("Failed to load orders");
        }
      } catch (err) {
        setLocalError("Error loading orders. Please try again.");
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    trackingOrders();
  }, []);

  const getUnreadCount = (orderId: string) => {
    return messages.filter((msg) => 
    msg.orderId === orderId &&
    msg.senderId !== currentUserId &&
    !msg.read
    ).length
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "ACCEPTED": return "bg-blue-100 text-blue-800 border-blue-300";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800 border-blue-300";
      case "DELIVERED": return "bg-green-100 text-green-800 border-green-300";
      case "COMPLETED": return "bg-green-300 text-green-900 border-green-300";
      case "CANCELLED": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateInput: Date | undefined) => {
    if (!dateInput) return "—";
    return new Date(dateInput).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleMessageClick = (order: OrderDetail) => {
  setSelectedOrder(order);
  setShowChatModal(true);
  markAsRead(order._id as string);
  };

  const handleOrderModal = (order: OrderDetail) => {
    setSelectedOrder(order);
    setShowModal(true);
    markAsRead(order._id as string)
  };

  const handleRetry = () => {
    setLocalError(null);
    window.location.reload();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center text-gray-600 py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all your orders</p>
          </div>
          <button
            onClick={() => navigate(userRoutes.FREELANCER_DASH)}
            className="bg-gray-800 hover:bg-gray-900 transition-colors text-white font-medium px-6 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Error State */}
        {localError && (
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{localError}</p>
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Connection Status Indicator */}
        <div className="mb-6 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-blue-900">{ordersList.length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {ordersList.filter((order) => order?.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Accepted</p>
            <p className="text-2xl font-bold text-blue-700">
              {ordersList.filter((order) => order.status === "ACCEPTED").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm font-medium">In Progress</p>
            <p className="text-2xl font-bold text-purple-900">
              {ordersList.filter((order) => order.status === "IN_PROGRESS")
                .length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Delivered</p>
            <p className="text-2xl font-bold text-green-700">
              {ordersList.filter((order) => order.status === "DELIVERED").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-200 to-green-300 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-900">
              {ordersList.filter((order) => order.status === "COMPLETED").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-red-900">
              {ordersList.filter((order) => order.status === "CANCELLED").length}
            </p>
          </div>
        </div>

        {/* Orders Table or Empty State */}
        {ordersList.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            <p className="text-lg font-medium mb-3">No orders found yet.</p>
            <p className="text-gray-500">Orders from clients will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white text-sm uppercase tracking-wider">
                  <th className="p-4">#</th>
                  <th className="p-4">Gig Title</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4">Delivery Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map((order, index) => (
                  
                  <tr
                    key={order._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 font-medium text-gray-700">{index + 1}</td>
                    <td className="p-4 text-gray-800 font-medium">
                      {order.gig?.title || "—"}
                    </td>
                    <td className="p-4 text-gray-600">{order.client?.name || "—"}</td>
                    <td className="p-4 text-gray-800 font-semibold text-green-700">
                      ₹{order.gig?.pricing.basic?.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-center text-gray-600">
                      {formatDate(order?.acceptedAt)}
                    </td>
                    <td className="p-4 text-center text-gray-600">
                      {formatDate(order?.deliveredAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                          order.status as string
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleMessageClick(order)}
                        className="hover:text-purple-800 text-purple-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 relative"
                        title="Message Client">
                        <MessageSquare size={16} />
                        {getUnreadCount(order._id as string) > 0 && (
                          <span className="absolute -top-1 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {getUnreadCount(order._id as string)}
                          </span>
                        )}
                        Message
                      </button>
                        <button
                          onClick={() => handleOrderModal(order)}
                          className="bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <OrderModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder._id as string}
            title={selectedOrder.gig?.title as string}
            client={selectedOrder.client?.name as string}
            amount={selectedOrder.gig?.pricing.basic?.price as number}
            status={selectedOrder.status as string}
            requirements={selectedOrder.requirements as string}
          />
        )}

        {/* Chat Modal */}
        {selectedOrder && (
          <ChatModal
            isOpen={showChatModal}
            onClose={() => {
              setShowChatModal(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder._id as string}
            recipientId={selectedOrder.client?._id || ""}
            recipientName={selectedOrder.client?.name as string}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />
        )}
      </div>
    </div>
  );
}

export default ListedOrdersComp;