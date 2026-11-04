import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import { useEffect, useState } from "react";
import { getOrderList } from "@/api/freelancer.api";
import { OrderDetail } from "@/types/user.type";
import OrderModal from "./orderModal";
import { useMessagingContext } from "@/context/messagingContext";
import { MessageSquare, ShoppingBag, ArrowLeft, RefreshCw, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
  const [showChatModal, setShowChatModal] = useState(false);

  const freelancerId = useSelector((state: RootState) => state.user._id);
  const freelancerName = useSelector((state: RootState) => state.user.name);
  const { isConnected, messages, markAsRead } = useMessagingContext();

  const currentUserId = freelancerId;
  const currentUserName = freelancerName;

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
    ).length;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "ACCEPTED": return "bg-sky-50 text-sky-700 border-sky-200/60";
      case "IN_PROGRESS": return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "DELIVERED": return "bg-teal-50 text-teal-700 border-teal-200/60";
      case "COMPLETED": return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "CANCELLED": return "bg-rose-50 text-rose-700 border-rose-200/60";
      default: return "bg-slate-100 text-slate-700 border-slate-200/60";
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
    markAsRead(order._id as string);
  };

  const handleRetry = () => {
    setLocalError(null);
    window.location.reload();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 font-medium">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-xs border border-slate-200/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Manage and track all client workflows and deliverables</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Live Connection Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-600">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isConnected ? 'Live Connected' : 'Connecting...'}
            </div>

            <button
              onClick={() => navigate(userRoutes.FREELANCER_DASH)}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-2xl text-sm transition-all shadow-xs"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
          </div>
        </div>

        {/* Error State */}
        {localError && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center">
            <p className="text-rose-800 font-semibold">{localError}</p>
            <button
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* Stats Grid - 2 Rows (4 on top, 3 on bottom) */}
        <div className="space-y-3">
          {/* Top Row: 4 Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/60">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{ordersList.length}</p>
            </div>
            <div className="bg-white  p-4 rounded-2xl shadow-xs border border-slate-200/60">
              <p className="text-amber-600 text-sm font-bold uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-black text-amber-700 mt-1">
                {ordersList.filter((order) => order?.status === "PENDING").length}
              </p>
            </div>
            <div className="bg-white  p-4 rounded-2xl shadow-xs border border-slate-200/60">
              <p className="text-sky-600 text-sm font-bold uppercase tracking-wider">Accepted</p>
              <p className="text-2xl font-black text-sky-700 mt-1">
                {ordersList.filter((order) => order.status === "ACCEPTED").length}
              </p>
            </div>
            <div className="bg-white  p-4 rounded-2xl shadow-xs border border-slate-200/60">
              <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-black text-indigo-700 mt-1">
                {ordersList.filter((order) => order.status === "IN_PROGRESS").length}
              </p>
            </div>
          </div>

          {/* Bottom Row: 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white  p-4 rounded-2xl shadow-xs border border-slate-200/60">
              <p className="text-teal-600 text-sm font-bold uppercase tracking-wider">Delivered</p>
              <p className="text-2xl font-black text-teal-700 mt-1">
                {ordersList.filter((order) => order.status === "DELIVERED").length}
              </p>
            </div>
            <div className="bg-white  p-4 rounded-2xl shadow-xs border border-slate-200/60">
              <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {ordersList.filter((order) => order.status === "COMPLETED").length}
              </p>
            </div>
            <div className="bg-white  p-4 rounded-2xl shadow-xs border border-slate-200/60">
              <p className="text-rose-600 text-sm font-bold uppercase tracking-wider">Cancelled</p>
              <p className="text-2xl font-black text-rose-700 mt-1">
                {ordersList.filter((order) => order.status === "CANCELLED").length}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/60 overflow-hidden">
          {ordersList.length === 0 ? (
            <div className="py-20 px-6 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No orders found yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">Orders from clients will appear here once booked.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white border">
                <thead>
                  <tr className="bg-indigo-700 border-b border-slate-200/60 text-white text-xs uppercase tracking-wider font-extrabold">
                    <th className="py-4 px-6">#</th>
                    <th className="py-4 px-6">Gig Title</th>
                    <th className="py-4 px-6">Client</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6 text-center">Order Date</th>
                    <th className="py-4 px-6 text-center">Delivery Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {ordersList.map((order, index) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-slate-500 font-bold">#{index + 1}</td>
                      <td className="py-4 px-6 text-slate-800 font-semibold max-w-xs truncate">
                        {order.gig?.title || "—"}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">{order.client?.name || "—"}</td>
                      <td className="py-4 px-6 font-black text-emerald-600">
                        ₹{order.gig?.pricing?.basic?.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-500 font-medium">
                        {formatDate(order?.acceptedAt)}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-500 font-medium">
                        {formatDate(order?.deliveredAt)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                            order.status as string
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleMessageClick(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors relative"
                            title="Message Client"
                          >
                            <MessageSquare size={14} />
                            <span>Chat</span>
                            {getUnreadCount(order._id as string) > 0 && (
                              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                {getUnreadCount(order._id as string)}
                              </span>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleOrderModal(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Modal */}
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
            amount={selectedOrder.gig?.pricing?.basic?.price as number}
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