import { useEffect, useState, type ReactNode } from "react";
import { getNotification, readAllNotification } from "../services/notificationServices";
import { toast } from "react-toastify";
import { socket } from "../socket/config";
import NavBar from "../components/NavBar";
import type { Notification } from "../models/interfaces/Notification";


interface layoutProps{
    children: ReactNode,
    
}

const Layout: React.FC<layoutProps>= ({children})=>{
 const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await getNotification();
        if (!response) {
          toast.error("Fail to get notification data", { pauseOnHover: false });
        }
        setNotifications(response.notification);
        setUnreadCount(response.unread);
      } catch (error) {
        toast.error("Failed to get notification data");
        console.error(error);
      }
    };
    fetchNotification();
  }, [isOpen]);

  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = (noti: Notification) => {
      setNotifications((prev) => [noti, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info("You have a new notification!", { pauseOnHover: false });
    };
    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await readAllNotification();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      toast.error("Failed to mark notifications as read");
      console.error(err);
    }
  };

 

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Nav */}
      <NavBar
        onClose={() => setIsOpen(false)}
        onOpen={() => {
          setIsOpen(true);
          handleMarkAllRead();
        }}
        notificationList={notifications}
        unreadCount={unreadCount}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 flex flex-col min-h-0">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
