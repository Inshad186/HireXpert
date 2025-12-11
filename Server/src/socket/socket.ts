
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export let io: Server;
export const onlineUsers: Record<string, string> = {};

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User registers with their userId
    socket.on("register", (userId: string) => {
      onlineUsers[userId] = socket.id;
      console.log("User registered:", userId, socket.id);
      
      // Join user to a personal room using their userId
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // Listen for new orders and emit notification to freelancer
    socket.on("new_order_placed", (data) => {
      const { freelancerId, orderId, clientName, gigTitle } = data;
      
      // Emit to specific freelancer's room
      io.to(`user_${freelancerId}`).emit("notification", {
        id: orderId,
        type: "new_order",
        title: "New Order Received! 🎉",
        message: `${clientName} ordered "${gigTitle}"`,
        orderId: orderId,
        clientName: clientName,
        gigTitle: gigTitle,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          console.log("User removed:", userId);
          break;
        }
      }
    });
  });
};