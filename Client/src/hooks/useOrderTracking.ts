import { useCallback, useEffect, useState } from "react"
import { deliveryOrder, getOrderList, inProgressOrder } from "@/api/freelancer.api"
import { acceptOrder } from "@/api/freelancer.api";
import { io, Socket } from 'socket.io-client';

export interface Order {
  _id: string;
  client: {
    name: string;
  };
  gig: {
    title: string;
    pricing: {
      basic: {
        price: number;
      }
    }
  }
  plan: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'REVISION' | 'REJECTED' | 'CANCELLED';
  acceptedAt?: Date;
  startedAt?: Date;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export const useOrderTracking = (userId: string) => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = useCallback(async() => {
    try {
      setLoading(true)
      const response = await getOrderList()
      if(response.success){;        
        setOrders(response.data?.orderDetails)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(() => {
    if(!userId) return

    fetchOrders()

    // Connect to Socket.io for real-time updates
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = apiUrl.replace('/api', '');
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Order tracking socket connected:', newSocket.id);
      newSocket.emit('register', userId);
    });

    // Listen for real-time order status changes
    newSocket.on('orderStatusChanged', (data) => {
      console.log('Order status changed in real-time:', data);
      
      setOrders((prev) =>
        prev.map((order) =>
          order._id === data.orderId
            ? { ...order, status: data.newStatus }
            : order
        )
      );
    });

    newSocket.on('disconnect', () => {
      console.log('Order tracking socket disconnected');
    });

    return () => {
      newSocket.close();
    };
  }, [userId, fetchOrders]);

  //! ACCEPT ORDER
  const acceptOrders = useCallback(async(orderId: string): Promise<ApiResponse> => {
    setActionLoading(orderId);
    
    try {
      const response = await acceptOrder(orderId)
      if (response.success) {        
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'ACCEPTED', acceptedAt: new Date()} : order
          )
        );
        return { success: true, message: 'Order accepted successfully'};
      } else {
        return { success: false, message: response.error || 'Failed to accept order' };
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      return { success: false, message: 'Failed to accept order' };
    } finally {
      setActionLoading(null);
    }
  }, [])

  const startWork = useCallback(async(orderId: string) => {
    setActionLoading(orderId)
    try {
      const response = await inProgressOrder(orderId)
      if(response.success){
        setOrders((prev) =>
        prev.map((order) =>
        order._id === orderId ? {...order, status: "IN_PROGRESS", acceptedAt: new Date()} : order))
      }
      return { success: true, message: "Order inProgress"}
    } catch (error) {
      console.error('Error inProgress order:', error);
      return { success: false, message: 'Failed inProgress order' };
    } finally {
      setActionLoading(null)
    }
  },[])

  const submitDelivery = useCallback(async(orderId: string, deliveryFiles: File[], deliveryNotes: string) => {
    setActionLoading(orderId);
    
    try {
      const response = await deliveryOrder(orderId, deliveryFiles, deliveryNotes)
      console.log("submitDelivery Response", response)
      if(response.success){
        setOrders((prev) =>
        prev.map((order =>
          order._id === orderId ? {...order, status: "DELIVERED", deliveredAt: new Date(), deliveryFiles} : order
        )))
      }
      return { success: true, message: "Delivery submitted successfully"}
    } catch (error) {
      console.error('Error submit delivery', error);
      return { success: false, message: 'Failed submit delivery' };
    } finally {
      setActionLoading(null);
    }
  }, [])

  return {
    orders,
    socket,
    loading,
    actionLoading,
    acceptOrders,
    startWork,
    submitDelivery,
    refetch: fetchOrders,
  }
}


