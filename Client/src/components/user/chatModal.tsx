import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { getMessages } from '@/api/message.api';
import { useMessagingContext } from '@/context/messagingContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  recipientId: string;
  recipientName: string;
  currentUserId: string;
  currentUserName: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  orderId,
  recipientId,
  recipientName,
  currentUserId,
  currentUserName,
}) => {

  const { messages, sendMessage, isConnected, isTyping, markAsRead, loadMessages } = useMessagingContext()
  const [messageText, setMessageText] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadInitialMessages = async () => {
      try {
        const response = await getMessages(orderId);
        console.log("Chat modal Response : ",response)
        if (response.success) {
          loadMessages(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    loadInitialMessages();
    markAsRead(orderId);

  }, [isOpen, orderId]);

  useEffect(() => {
    const orderMessages = messages.filter((msg) => msg.orderId === orderId);
    setFilteredMessages(orderMessages);
    scrollToBottom();
  }, [messages, orderId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !isConnected) {
      alert('Please check your connection');
      return;
    }
    sendMessage(orderId, recipientId, currentUserName, messageText);
    setMessageText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{recipientName}</h2>
            <p className="text-sm text-gray-500">Order: {orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Connection Status */}
        <div className="px-6 py-2 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-600">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === currentUserId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderId === currentUserId
                        ? 'text-blue-100'
                        : 'text-gray-600'
                    }`}
                  >
                    {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="bg-gray-300 rounded-full px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form 
        onSubmit={handleSendMessage} 
        className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={!isConnected || !messageText.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};