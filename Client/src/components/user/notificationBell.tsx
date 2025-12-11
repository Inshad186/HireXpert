import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotification";

interface NotificationBellProps {
  userId: string | undefined;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const { notifications } = useNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell size={24} className="text-gray-700" />

        {/* Notification Badge */}
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {notifications.length}
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

          {/* Empty State */}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell size={40} className="text-gray-300 mb-2" />
              <p className="text-gray-500 text-center">No notifications yet</p>
            </div>
          )}

          {/* Render Notification List */}
          {notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((note) => (
                <div
                  key={note._id}
                  className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition cursor-pointer"
                >
                  <h4 className="font-semibold text-gray-800">{note.title}</h4>
                  <p className="text-sm text-gray-600">{note.message}</p>

                  {/* Extra Info */}
                  {note.clientName && (
                    <p className="text-xs text-gray-500 mt-1">
                      Client: {note.clientName}
                    </p>
                  )}
                  {note.gigTitle && (
                    <p className="text-xs text-gray-500">
                      Gig: {note.gigTitle}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
