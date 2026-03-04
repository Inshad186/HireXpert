    import { useEffect, useState } from 'react';
    import { io, Socket } from 'socket.io-client';

    interface Message {
    _id: string;
    orderId: string;
    senderId: string;
    senderName: string;
    recipientId: string;
    content: string;
    timestamp: Date;
    read: boolean;
    }

    export const useMessaging = (userId: string | null) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Initialize socket connection
    useEffect(() => {
        if (!userId) return;

        const newSocket = io('http://localhost:5000', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        });

        // Connect event
        newSocket.on('connect', () => {
        console.log('✅ Connected to server');
        setIsConnected(true);
        
        // Register this user with the server
        newSocket.emit('register', userId);
        });

        // Receive new messages
        newSocket.on('newMessage', (message: Message) => {
        console.log('💬 New message received:', message);
        setMessages((prev) => [...prev, message]);
        });

        // Message sent confirmation
        newSocket.on('messageSent', (data) => {
        console.log('✅ Message delivered:', data);
        });

        // Typing indicator
        newSocket.on('userTyping', (data) => {
        if (data.isTyping) {
            setIsTyping(true);
            // Auto-hide after 3 seconds
            setTimeout(() => setIsTyping(false), 3000);
        }
        });

        // Listen when messages are marked as read
        newSocket.on("messagesRead", ({ orderId, userId: readerId }) => {
        setMessages((prev) =>
            prev.map((msg) =>
            msg.orderId === orderId &&
            msg.recipientId === readerId
                ? { ...msg, read: true }
                : msg
            )
        );
        });

        // Error handling
        newSocket.on('messageError', (error) => {
        console.error('❌ Message error:', error);
        });

        // Disconnect event
        newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
        newSocket.disconnect();
        };
    }, [userId]);

    // Send message function
    const sendMessage = ( orderId: string, recipientId: string, senderName: string, content: string ) => {
        if (!socket || !userId) {
        console.error('Socket not connected or userId missing');
        return;
        }
        console.log('Sending message...');
        socket.emit('sendMessage', { orderId, senderId: userId, senderName, recipientId, content });
    };

    const loadMessages = (msgs: Message[]) => {
    if (!Array.isArray(msgs)) return;

    setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const newOnes = msgs.filter((m) => !existingIds.has(m._id));
        return [...prev, ...newOnes];
    });
    };

    const markAsRead = (orderId: string) => {
    if (!socket || !userId) return;

    socket.emit("markAsRead", { orderId, userId,});
    setMessages((prevMessage) => (
        prevMessage.map((msg) => (
            msg.orderId === orderId && !msg.read
            ? {...msg, read: true}
            : msg
        ))
    ))
    };
    return { messages, isConnected, isTyping, sendMessage, markAsRead, loadMessages };
    };