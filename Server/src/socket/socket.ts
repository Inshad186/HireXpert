
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import messageModel from "@/models/messageModel";

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

    socket.on("register", (userId: string) => {
      onlineUsers[userId] = socket.id;
      console.log("User registered:", userId, socket.id);

      socket.join(`user_${userId}`);

      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const message = await messageModel.create({
          orderId: data.orderId,
          senderId: data.senderId,
          senderName: data.senderName,
          recipientId: data.recipientId,
          content: data.content,
          timestamp: new Date(),
          read: false
        })
        // ✅ Send to recipient
        io.to(`user_${data.recipientId}`).emit("newMessage", message)
        
        // ✅ ALSO send back to sender
        io.to(`user_${data.senderId}`).emit("newMessage", message);

        socket.emit("messageSent", {
          success: true,
          messageId: message._id,
        })

        console.log(`✅ Message delivered to user ${data.recipientId}`);
      } catch (error) {
        console.error("Error in sending message", error)
        socket.emit("messageError", {
          success: false,
          error: "Failed to send message"
        })
      }
    })

    socket.on("markAsRead", async ({ orderId, userId }) => {
      try {
        await messageModel.updateMany(
          {
            orderId,
            recipientId: userId,
            read: false
          },
          { $set: { read: true } }
        );

        io.to(`user_${userId}`).emit("messagesRead", { orderId });

      } catch (error) {
        console.error("Mark as read error", error);
      }
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