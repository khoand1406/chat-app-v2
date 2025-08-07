import MessageList from './MessageList';
import MessageInput from  './MessageInput';
import type { ChatWindowProps } from '../models/props/ChatWindowProps';

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-300 bg-white font-semibold">
        Chat with User X
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <MessageList />
      </div>

      {/* Input */}
      <div className="border-t border-gray-300">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;