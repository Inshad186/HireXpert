import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";

interface Order {
  _id: string;
  gigTitle: string;
  clientName: string;
  amount: number;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  deliveryDate: string;
  orderDate: string;
}

interface ListedOrdersCompProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onUpdateStatus?: (orderId: string, newStatus: string) => Promise<void>;
}

function ListedOrdersComp({ orders, loading, error, onUpdateStatus }: ListedOrdersCompProps) {
  const navigate = useNavigate();

  // Status badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center text-red-600 py-20">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium">{error}</p>
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
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm font-medium">In Progress</p>
            <p className="text-2xl font-bold text-purple-900">
              {orders.filter((o) => o.status === "in_progress").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-900">
              {orders.filter((o) => o.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Orders Table or Empty State */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
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
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 font-medium text-gray-700">{index + 1}</td>
                    <td className="p-4 text-gray-800 font-medium">
                      {order.gigTitle || "—"}
                    </td>
                    <td className="p-4 text-gray-600">{order.clientName || "—"}</td>
                    <td className="p-4 text-gray-800 font-semibold">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(order.deliveryDate)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListedOrdersComp;