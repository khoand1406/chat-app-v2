import { useState, useEffect } from 'react';

import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import type { IConversationResponse } from '../models/interfaces/Conversation';
import { getConversations } from '../services/conversationServices';

const ChatApp = () => {
    const [selectedConversationId, setSelectedConversationId] = useState<number>(0);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [conversationsList, setConversationsList] = useState<IConversationResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response= await getConversations();
              setConversationsList(response);
              setSelectedConversationId(response[0].id);
            } catch (error) {
              console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleSelectConversation = (id: number) => {
        setSelectedConversationId(id);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchMessages = (id: number) => {
            const messages = [
                { id: 1, text: 'Hello!', sender: 'Alice', timestamp: '10:00 AM' },
                { id: 2, text: 'Hi there!', sender: 'Bob', timestamp: '9:30 AM' },
                { id: 3, text: 'Good morning!', sender: 'Charlie', timestamp: '8:45 AM' },
            ];
            return messages.filter(msg => msg.id === id)[0] || null;
        };
        fetchMessages(selectedConversationId);
    }, []);
  return (
    <>
      <Sidebar
        conversations={conversationsList}
        selectedId={selectedConversationId}
        onSelect={(id) => setSelectedConversationId(id)}
        isMobileOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <ChatWindow conversationId={selectedConversationId} />
      </div>
    </>
  );
};

export default ChatApp;
