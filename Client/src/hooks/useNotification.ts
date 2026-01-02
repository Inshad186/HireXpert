import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getNotification, markAsRead, deleteNotification} from "@/api/notification.api";
import { NotificationType } from "@/types/user.type";

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch existing notifications from database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotification();
      console.log("Notification Hook:", res);
      if (res.success) {
        setNotifications(res.data.notifications);
        const unread = res.data.notifications.filter((x: NotificationType) => !x.isRead).length
        setUnreadCount(unread)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      newSocket.close();
    };
  }, [userId, fetchNotifications]);

  // FIXED: Added proper console.log and error handling
  const markasRead = useCallback(async (notificationId: string) => {
    console.log("Marking as read - Notification ID:", notificationId); 
    
    if (!notificationId) {
      console.warn("Invalid notification ID");
      return;
    }
    try {
      const res = await markAsRead(notificationId);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((notify) =>
            notify._id === notificationId ? { ...notify, isRead: true } : notify
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const deletenotification = useCallback(
    async (notificationId: string) => {
      console.log("Deleting notification - ID:", notificationId);
      
      if (!notificationId) {
        console.warn("Invalid notification ID for deletion");
        return;
      }

      try {
        await deleteNotification(notificationId);
        setNotifications((prev) => prev.filter((notify) => notify._id !== notificationId));
        
        // Update unread count if deleted notification was unread
        setUnreadCount((prev) => {
          const deletedNotify = notifications.find(n => n._id === notificationId);
          return deletedNotify && !deletedNotify.isRead ? Math.max(0, prev - 1) : prev;
        });
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [notifications]
  );

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      // Delete all notifications
      for (const notify of notifications) {
        await deleteNotification(notify._id);
      }
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  }, [notifications]);

  return {
    notifications,
    socket,
    loading,
    unreadCount,
    markasRead,
    deletenotification,
    clearAll,
    refetch: fetchNotifications,
  };
};