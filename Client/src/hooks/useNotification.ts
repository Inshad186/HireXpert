import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getNotification } from "@/api/notification.api";

export interface NotificationType {
  _id: string;
  type: "new_order" | "order_completed" | "message" | "review";
  title: string;
  message: string;
  orderId?: string;
  gigTitle?: string;
  clientName?: string;
  createdAt: string;
  isRead: boolean;
}

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing notifications from database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotification();
      console.log("Notification Hook:", res);
      if (res.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize Socket.io connection
  useEffect(() => {
    if (!userId) return;

    // Fetch notifications from database on mount
    fetchNotifications();

    // Connect to Socket.io
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const socketUrl = apiUrl.replace("/api", "");
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      // Register freelancer with their userId
      newSocket.emit("register", userId);
    });

    // Listen for new notifications (real-time)
    newSocket.on("notification", (data) => {
      console.log("New notification received:", data);

      const newNotification: NotificationType = {
        _id: data._id?.toString() || Date.now().toString(),
        type: data.type,
        title: data.title,
        message: data.message,
        orderId: data.orderId?.toString(),
        gigTitle: data.gigTitle,
        clientName: data.clientName,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      // Add to beginning of notifications array
      setNotifications((prev) => [newNotification, ...prev]);

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification(data.title, {
          body: data.message,
          icon: "/logo.png",
        });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [userId, fetchNotifications]);

  return {
    notifications,
    socket,
    loading,
    refetch: fetchNotifications,
  };
};