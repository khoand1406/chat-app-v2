import {
  IoNotifications,
  IoSettingsSharp,
  IoCheckmarkCircle,
} from "react-icons/io5";
import type { Notification } from "../models/interfaces/Notification";
import { formatDate } from "../utils/FormatDate";

interface NotificationProps {
  isOpen: boolean;
  notifications: Notification[]
  unread: number

}

const NotificationPanel: React.FC<NotificationProps> = ({ isOpen, notifications }) => {
  

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
                notification.isRead ? "bg-gray-50" : "bg-white"
              }`}
              // onClick={() => markAsRead(notification.id)}
            >
              {notification.isRead && (
                <div className="absolute left-0 top-0 w-1 h-full bg-[#6264A7] rounded-l-lg" />
              )}
              
              <div className="ml-3 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.content}
                </p>
              </div>
              {!notification.isRead && (
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
