import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import ChatWindow from "../components/ChatWindow";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import type { IConversationResponse } from "../models/interfaces/Conversation";
import type { MessageResponse } from "../models/interfaces/Messages";
import { getConversations } from "../services/conversationServices";
import { getMessages, setReadMessages } from "../services/messageServices";
import { socket } from "../socket/config";
import { getNotification, readAllNotification } from "../services/notificationServices";
import type { Notification } from "../models/interfaces/Notification";

const ChatApp = () => {
  const [selectedConversationId, setSelectedConversationId] =
    useState<number>(0);
  const [sidebarOpen] = useState<boolean>(false);
  const [conversationsList, setConversationsList] = useState<
    IConversationResponse[]
  >([]);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isChatWindowActive, setIsChatWindowActive] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen]= useState(false);
  const [unreadCount, setUnreadCount]= useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsChatWindowActive(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    socket.connect();
    socket.emit("join", userId);

    const fetchConversations = async () => {
      try {
        const response = await getConversations();
        setConversationsList(response);
        if (response.length > 0) {
          setSelectedConversationId(response[0].id);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
    socket.on("conversationCreated", async (conv) => {
      try {
        const fullConv = await getConversations();
        setConversationsList(fullConv);
        setSelectedConversationId(conv.id);
      } catch (err) {
        console.error("Error fetching new conversation:", err);
      }
    });

    return () => {
      socket.off("conversationCreated");
      socket.disconnect();
    };
  }, [userId]);

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      toast("Invalid login session, navigating to Login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (!selectedConversationId || !userId) return;

    const markRead = async () => {
      try {
        await setReadMessages(selectedConversationId);
        socket.emit("messagesRead", {
          conversationId: selectedConversationId,
          userId,
        });
        setConversationsList((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      } catch (error) {
        console.log(error);
        toast.error("Fail to mark as read");
      }
    };
    markRead();

    const fetchMessagesById = async () => {
      try {
        const response = await getMessages(selectedConversationId);
        setMessages(response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessagesById();

    const handleMessageSent = async (message: MessageResponse) => {
      
      if (message.conversationId === selectedConversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        if (isChatWindowActive) {
          try {
            await setReadMessages(selectedConversationId);
            socket.emit("messageRead", {
              conversationId: selectedConversationId,
              userId: userId,
            });
          } catch (error) {
            console.error("Fail to mark read conversation message", error);
          }
        }
      }
     
      setConversationsList((prev) =>
        prev
          .map((conv) => {
            if (conv.id === message.conversationId) {
              if (conv.id === selectedConversationId) {
                return {
                  ...conv,
                  lastMessage: message.content,
                  lastUserName:message.user.userName,
                  // thêm
                  lastUserSent: message.senderId, // thêm
                  timestamp: message.sendAt.toString(),
                  unreadCount: 0,
                };
              } else {
                return {
                  ...conv,
                  lastMessage: message.content,
                  lastUserSent: message.senderId,
                  lastUserName: message.user.userName,
                  timestamp: message.sendAt.toString(),
                  unreadCount: (conv.unreadCount || 0) + 1,
                };
              }
            }
            return conv;
          })
          .sort(
            (a, b) =>
              new Date(b.timestamp || "").getTime() -
              new Date(a.timestamp || "").getTime()
          )
      );
    };
    console.log(conversationsList);
    socket.on("messageSent", handleMessageSent);
    
    return () => {
      socket.off("messageSent", handleMessageSent);
    };
  }, [selectedConversationId, userId]);

  useEffect(() => {
    const handleMessageRead = ({
      conversationId,
      userId: readerId,
    }: {
      conversationId: number;
      userId: number;
    }) => {
      setConversationsList((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                unreadCount: 0,
              }
            : conv
        )
      );
      
    };

    socket.on("messagesRead", handleMessageRead);

    return () => {
      socket.off("messagesRead", handleMessageRead);
    };
  }, []);

   useEffect(()=> {
    const fetchNotification= async ()=> {
      try {
        const response= await getNotification();
        if(!response){
          toast.error("Fail to get notification data", {pauseOnHover: false});
        }
        const notificationList= response.notification;
        const unreadCount= response.unread
        setNotifications(notificationList);
        setUnreadCount(unreadCount);
      } catch (error) {
        toast.error("Failed to get notification data");
        console.log(error);
      }
    }

    fetchNotification();
  }, [isOpen])

  useEffect(()=> {
    if(!socket) return;
    const handleNewNotification= (noti: Notification)=> {
      setNotifications((prev)=> [noti, ...prev]);
      setUnreadCount((prev)=> prev+1);
      toast.info("You have a new notification!", { pauseOnHover: false });
    }
    socket.on('newNotification', handleNewNotification)
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket])

  const handleMarkAllRead = async () => {
  try {
    await readAllNotification();
    setUnreadCount(0); 
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  } catch (err) {
    toast.error("Failed to mark notifications as read");
    console.error(err);
  }
};

  return (
    <>
      <NavBar onClose={() => setIsOpen(false)} 
  onOpen={() => {
    setIsOpen(true);
    handleMarkAllRead(); // 🔔 mark all read khi mở
  }}
   notificationList= {notifications}
   unreadCount= {unreadCount}
    />

      <Sidebar
        conversations={conversationsList}
        selectedId={selectedConversationId}
        onSelect={(id) => handleSelectConversation(id)}
        isMobileOpen={sidebarOpen}
        currentUserId={parseInt(userId ? userId : "")}
      />

      <div className="flex-1 flex flex-col">
        <ChatWindow
          conversationId={selectedConversationId}
          messages={messages}
          displayName={
            conversationsList.find((conv) => conv.id === selectedConversationId)
              ?.displayname || ""
          }
          avatarUrl={
            conversationsList.find((conv) => conv.id === selectedConversationId)
              ?.avatarUrl || ""
          }
          currentUserId={userId ? parseInt(userId) : 0}
        />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default ChatApp;
