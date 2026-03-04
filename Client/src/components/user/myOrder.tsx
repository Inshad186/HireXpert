import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, MessageSquare, Download, Truck, ClipboardCheck } from 'lucide-react';
import { getMyOrders } from '@/api/client.api';
import { OrderDetail } from '@/types/user.type';
import { useClientOrderAction } from '@/hooks/useClientOrderAction';
import { ChatModal } from './chatModal';
import { ClientDeliveryModal } from './clientDeliveryModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useMessagingContext } from '@/context/messagingContext';

function MyOrders() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)

  const userId = useSelector((state: RootState) => state.user._id)
  const clientName = useSelector((state: RootState) => state.user.name)

  const { messages, markAsRead } = useMessagingContext()
  const { acceptDelivery, requestRevision, actionLoading } = useClientOrderAction()

  const currentUserId = userId; 
  const currentUserName = clientName;

  const getStatusColor = (status: string = '') => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string = '') => {
    switch(status) {
      case 'PENDING': return <Clock size={18} />;
      case 'ACCEPTED': return <ClipboardCheck size={18} />;
      case 'IN_PROGRESS': return <Clock size={18} />;
      case 'DELIVERED': return <Truck size={18} />;
      case 'COMPLETED': return <CheckCircle size={18} />;
      case 'CANCELLED': return <XCircle size={18} />;
      default: return null;
    }
  };

  const getUnreadCount = (orderId: string) => {
    return messages.filter(
      (msg) => 
      msg.orderId === orderId &&
      msg.senderId !== currentUserId &&
      !msg.read).length
  }

  const filteredOrders = activeTab === "ALL"
    ? orders 
    : orders.filter((order) => order.status === activeTab);

  useEffect(() => {
    const fetchOrderDetails = async() => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyOrders();
        if(res.success){
          setOrders(res.data.OrderDetail || []);
        }
      } catch (error) {
        console.error("Error fetching order detail", error);
        setError('An error occurred while fetching your orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, []);

  const handleViewDelivery = (order: OrderDetail) => {
    if(order.status === "DELIVERED"){
      setSelectedOrder(order)
      setShowDeliveryModal(true)
    }
  }

  const handleMessageClick = (order: OrderDetail) => {
    setSelectedOrder(order);
    setShowChatModal(true);
    markAsRead(order._id as string)
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage all your freelance orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 bg-white rounded-t-lg">
        {['ALL', 'PENDING', 'ACCEPTED', 'IN-PROGRESS', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <div className='flex justify-center items-center mt-6'>
            <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="flex justify-center mb-4">
            <MessageSquare size={48} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {activeTab === 'all' 
              ? "You haven't placed any orders yet." 
              : `You don't have any ${activeTab} orders.`}
          </p>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{order.gig?.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Order ID: {order._id}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-green-600">₹{order.gig?.pricing?.basic?.price}</p>
                  <p className="text-sm text-gray-600">Freelancer: {order.freelancer?.name}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {order.status === "DELIVERED" ? (
                  <button
                  onClick={() => handleViewDelivery(order)}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded transition font-medium">
                    <Eye size={18}/>
                    <span className='text-sm font-medium'>Review Delivery</span>
                  </button>
                ) : (
                <button 
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition">
                  <Eye size={18} />
                  <span className="text-sm font-medium">View Details</span>
                </button>
                )}
                <button
                onClick={() => handleMessageClick(order)}
                 className="relative flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded transition">
                  <MessageSquare size={18} />
                  {getUnreadCount(order._id as string) > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {getUnreadCount(order._id as string)}
                    </span>
                  )}
                  Message
                </button>
                {order.status === 'COMPLETED' && (
                  <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded transition">
                    <Download size={18} />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                )}
              </div>

              {/* Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">{selectedOrder.gig?.title}</h2>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light"
                    >
                        ×
                    </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b">
                    <div>
                        <p className="text-gray-600 text-sm">Order ID</p>
                        <p className="text-lg font-semibold">{selectedOrder._id}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Freelancer</p>
                        <p className="text-lg font-semibold">{selectedOrder.freelancer?.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Amount</p>
                        <p className="text-xl font-bold text-green-600">₹{selectedOrder.gig?.pricing.basic?.price}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                        </span>
                    </div>
                    </div>

                    <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-2">Requirements</p>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{selectedOrder.requirements}</p>
                    </div>

                    <div className="flex gap-4">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Message Freelancer
                    </button>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Close
                    </button>
                    </div>
                </div>
                </div>
              )}
            </div>
          ))}
        </div>
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
          recipientId={selectedOrder.freelancer?._id || ""}
          recipientName={selectedOrder.freelancer?.name as string}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          />
      )}

      <ClientDeliveryModal
      order={selectedOrder}
      isOpen={showDeliveryModal}
      onClose={() => {
        setShowDeliveryModal(false)
        setSelectedOrder(null)
      }}
      onAccept={acceptDelivery}
      onRequestRevision={requestRevision}
      isLoading={actionLoading === selectedOrder?._id}/>
    </div>
  );
}

export default MyOrders;