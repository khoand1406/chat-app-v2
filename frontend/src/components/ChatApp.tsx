import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import type { IConversationResponse } from "../models/interfaces/Conversation";
import { getConversations } from "../services/conversationServices";
import { getMessages } from "../services/messageServices";
import type { MessageResponse } from "../models/interfaces/Messages";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import NavBar from "./NavBar";
import { socket } from "../socket/config";

const ChatApp = () => {
  const [selectedConversationId, setSelectedConversationId] =
    useState<number>(0);
  const [sidebarOpen] = useState<boolean>(false);
  const [conversationsList, setConversationsList] = useState<
    IConversationResponse[]
  >([]);
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if(!userId) return;
    socket.connect();
    socket.emit("join", userId)

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
      socket.on('conversationCreated', async (conv) => {
    
    try {
      const fullConv = await getConversations();
      console.log('Updated conversations:', fullConv);
      setConversationsList(fullConv);
      setSelectedConversationId(conv.id);
    } catch (err) {
      console.error("Error fetching new conversation:", err);
    }
  });


    return ()=>{
      socket.off('conversationCreated');
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
    if (!selectedConversationId) return;

    const fetchMessagesById = async () => {
      try {
        const response = await getMessages(selectedConversationId);
        setMessages(response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessagesById();
  }, [selectedConversationId]);
  return (
    <>
      <NavBar />

      <Sidebar
        conversations={conversationsList}
        selectedId={selectedConversationId}
        onSelect={(id) => handleSelectConversation(id)}
        isMobileOpen={sidebarOpen}
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
      </div>
    
      
    </>
  );
};

export default ChatApp;
