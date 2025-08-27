import {
  IoNotifications,
  IoSettingsSharp,
  IoCheckmarkCircle,
} from "react-icons/io5";
import type { Notification } from "../models/interfaces/Notification";
import { formatDate } from "../utils/FormatDate";
import { confirmEvent, rejectEvent } from "../services/eventServices";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

interface NotificationProps {
  isOpen: boolean;
  notifications: Notification[];
  unread: number;
  onAcceptInvite?: (notificationId: number) => void;
  onDeclineInvite?: (notificationId: number) => void;
}

const NotificationPanel: React.FC<NotificationProps> = ({
  isOpen,
  notifications,
}) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const confirmEventClick = async (eventId: number) => {
    try {
      await confirmEvent(eventId);
      toast.success("Add event successfully!");

      // Xoá notification khỏi local state
      setLocalNotifications((prev) =>
        prev.filter((n) => n.eventId !== eventId)
      );
    } catch (error) {
      toast.error("Failed to confirm event");
      console.error(error);
    }
  };

  const rejectEventClick = async (eventId: number) => {
    try {
      await rejectEvent(eventId);
      toast.success("Reject event successfully!");

      // Xoá notification khỏi local state
      setLocalNotifications((prev) =>
        prev.filter((n) => n.eventId !== eventId)
      );
    } catch (error) {
      toast.error("Failed to confirm event");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-4 h-[90vh] w-[380px] bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col z-[2000]">
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
        {localNotifications.length > 0 ? (
          localNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col p-4 hover:bg-gray-50 cursor-pointer transition-all relative ${
                notification.isRead ? "bg-gray-50" : "bg-white"
              }`}
            >
              {/* line màu loại noti */}
              {notification.type === "message" && (
                <div className="absolute left-0 top-0 w-1 h-full bg-[#3d43f3] rounded-l-lg" />
              )}

              <div className="flex-1">
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

                {/* Nếu là event_invite thì hiển thị Accept/Decline */}
                {notification.type === "event_invited" &&
                  notification.eventId &&
                  !notification.status && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() =>
                          confirmEventClick(
                            notification.eventId ? notification.eventId : 0
                          )
                        }
                        className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          rejectEventClick(
                            notification.eventId ? notification.eventId : 0
                          )
                        }
                        className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
              </div>

              {!notification.isRead && notification.type !== "event_invite" && (
                <IoCheckmarkCircle className="text-gray-400 ml-auto mt-1" />
              )}
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>No new notifications</p>
          </div>
        )}
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
};

export default NotificationPanel;
