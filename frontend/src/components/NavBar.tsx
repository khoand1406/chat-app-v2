import { MessageSquare, Users, Calendar, Bell } from "lucide-react";
import { useState } from "react";
import NotificationPanel from "./NotificationPanel"; // Import panel

const NavBar = () => {
  const navItems = [
    { id: 1, icon: <Bell size={24} />, label: "Notification" },
    { id: 2, icon: <MessageSquare size={24} />, label: "Chat" },
    { id: 3, icon: <Users size={24} />, label: "Teams" },
    { id: 4, icon: <Calendar size={24} />, label: "Calendar" },
  ];

  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleOpenNoti = (id: number): void => {
    if (id === 1) {
      setNotificationOpen((prev) => !prev); // Toggle
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-14 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center hover:bg-gray-800 p-2 rounded-lg transition-colors"
            onClick={() => handleOpenNoti(item.id)}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Notification Panel */}
      <NotificationPanel isOpen={notificationOpen} />
    </>
  );
};

export default NavBar;
