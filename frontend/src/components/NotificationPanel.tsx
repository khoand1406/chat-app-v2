import { useState } from "react";
import {
  IoNotifications,
  IoSettingsSharp,
  IoCheckmarkCircle,
} from "react-icons/io5";

interface NotificationProps {
  isOpen: boolean;
}

const NotificationPanel: React.FC<NotificationProps> = ({ isOpen }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      sender: "Alex Thompson",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
      message: "Shared a document: Q4 Marketing Strategy",
      timestamp: "10:30 AM",
      isUnread: true,
    },
    {
      id: 2,
      sender: "Sarah Wilson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      message: "Mentioned you in Design Team channel",
      timestamp: "9:45 AM",
      isUnread: true,
    },
    {
      id: 3,
      sender: "Mike Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      message: "Scheduled a meeting for tomorrow",
      timestamp: "Yesterday",
      isUnread: false,
    },
    {
      id: 4,
      sender: "Emily Davis",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      message: "Reacted to your message with 👍",
      timestamp: "Yesterday",
      isUnread: false,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isUnread: false } : n
      )
    );
  };

  if (!isOpen) return null; // Nếu đóng panel thì không render

  return (
    <div className="fixed right-4 top-4 h-[90vh] w-[380px] bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IoNotifications className="text-[#6264A7] text-2xl" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <IoSettingsSharp className="text-gray-600 text-xl" />
        </button>
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer transition-all relative ${
                notification.isUnread ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              {notification.isUnread && (
                <div className="absolute left-0 top-0 w-1 h-full bg-[#6264A7] rounded-l-lg" />
              )}
              <img
                src={notification.avatar}
                alt={notification.sender}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {notification.sender}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {notification.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
              </div>
              {!notification.isUnread && (
                <IoCheckmarkCircle className="text-gray-400 ml-2 mt-1" />
              )}
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
