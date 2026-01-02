import { useState } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotification";
import { useOrderTracking, Order } from "@/hooks/useOrderTracking";
import { OrderActionModal } from "./orderActionModal";
import { WorkDeliveryModal } from "./workDeliveryModal";
import { getOrders, rejectOrder } from "@/api/freelancer.api";

interface NotificationBellProps {
  userId: string | undefined;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const { notifications, loading, markasRead, unreadCount, deletenotification, clearAll } = useNotifications(userId);
  const { acceptOrders, actionLoading, startWork, submitDelivery  } = useOrderTracking(userId as string);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalType, setModalType] = useState<"action" | "delivery" | null>(null)

  const handleNotificationClick = (notificationId: string, read: boolean, orderId?: string) => {
    console.log("Notification clicked - ID:", notificationId, "Read:", read);
    
    if (!read) {
      markasRead(notificationId);
    }
    if (orderId) {
      handleOpenOrderModal(orderId);
    }
  };

  const handleOpenOrderModal = async (orderId: string) => {
    try {
      const response = await getOrders(orderId)
      if (response.success) {
        setSelectedOrder(response.data.orders);
        if(response.data.orders.status === "PENDING"){
          setModalType("action")
        }else if(response.data.orders.status === "ACCEPTED" || response.data.orders.status === "IN_PROGRESS"){
          setModalType("delivery")
        }else{
          setModalType("action")
        }
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleRejectOrder = async (orderId: string, reason: string) => {
    // TODO: Create a rejectOrder function in your hook similar to acceptOrders
    try {
      const response = await rejectOrder(orderId, reason)
      if (response.success) {
        return { success: true, message: 'Order rejected successfully' };
      } else {
        return { success: false, message: response.error || 'Failed to reject order' };
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      return { success: false, message: 'Failed to reject order' };
    }
  };

  const statusColor = (type: string) => {
    switch(type){
      case "new_order": return "bg-yellow-100 text-700"
      case "message": return "bg-blue-100 blue-700"
      case "order_completed": return "bg-green-100 green-700"
      case "review": return "bg-red-100 red-700"
      default : return ""
    }
  }

  return (
    <>
      <div className="relative">
        {/* Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell size={24} className="text-gray-700" />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto z-50 border border-gray-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell size={40} className="text-gray-300 mb-2" />
                <p className="text-gray-500 text-center">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notify) => (
                  <div
                    key={notify._id}
                    onClick={() => handleNotificationClick(notify._id, notify.isRead, notify.orderId)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      notify.isRead
                        ? "bg-red-200 border-l-4 border-red-800"
                        : "bg-blue-100 hover:bg-blue-200 border-l-4 border-blue-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{notify.gigTitle}</p>
                        <p className="text-xs text-gray-600 mt-1">Client: {notify.clientName}</p>
                        {notify.gigTitle && (
                          <p className={`inline px-3 py-1 text-xs font-semibold rounded-full ${statusColor(notify.type)}`}>
                            {notify.type}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletenotification(notify._id);
                        }}
                        className="text-black hover:text-red-500 ml-2 flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Clear All Button */}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="w-full mt-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Action Modal */}
      {modalType === "action" && (
        <OrderActionModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null)
          setModalType(null)
        }}
        onAccept={acceptOrders}
        onReject={handleRejectOrder}
        isLoading={actionLoading === selectedOrder?._id}/>
      )}

      {modalType === "delivery" && (
        <WorkDeliveryModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null)
          setModalType(null)
        }}
        onStartWork={startWork}
        onSubmitDelivery={submitDelivery}
        isLoading={ actionLoading === selectedOrder?._id}/>
      )}
    </>
  );
}