import MessageList from './MessageList';
import MessageInput from  './MessageInput';
import type { ChatWindowProps } from '../models/props/ChatWindowProps';

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, messages, currentUserId, displayName, avatarUrl }) => {
  return (
    
    <div className="flex flex-col h-full">
      {/* Header */}
      
      <div className="px-4 py-3 border-b border-gray-300 bg-white font-semibold flex items-center gap-2">
  <img
    src={
      avatarUrl
        ? avatarUrl
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
    }
    alt={displayName}
    className="w-8 h-8 rounded-full flex-shrink-0"
  />
  <span>{displayName}</span>
</div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-300">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
};

export default ChatWindow;