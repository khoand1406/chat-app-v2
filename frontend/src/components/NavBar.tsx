import { MessageSquare, Users, Calendar, Bell } from "lucide-react";
import React, { useState } from "react";
import NotificationPanel from "./NotificationPanel";
import type { Notification } from "../models/interfaces/Notification";
import { useNavigate } from "react-router";

interface NavBarProps {
  onClose: () => void;
  onOpen: () => void;
  notificationList: Notification[];
  unreadCount: number;
}

const NavBar: React.FC<NavBarProps> = ({
  onClose,
  notificationList,
  unreadCount,
  onOpen,
}) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 1, icon: <Bell size={24} />, label: "Notification" },
    { id: 2, icon: <MessageSquare size={24} />, label: "Chat" },
    { id: 3, icon: <Users size={24} />, label: "Teams" },
    { id: 4, icon: <Calendar size={24} />, label: "Calendar" },
  ];

  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleNavClick = async (id: number) => {
    if (id === 1) {
      setNotificationOpen((prev) => !prev);
      if (!notificationOpen) {
        try {
          onOpen();
        } catch (err) {
          console.error("Fail to mark notifications as read", err);
        }
      }
    } else if (id === 4) {
      navigate("/events");
    } else {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            className="relative flex flex-col items-center hover:bg-gray-800 p-2 rounded-lg transition-colors"
            onClick={() => handleNavClick(item.id)}
          >
            {item.icon}

            {item.id === 1 && unreadCount > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        notifications={notificationList}
        unread={unreadCount}
      />
    </>
  );
};

export default NavBar;
