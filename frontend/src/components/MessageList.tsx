import type { MessageResponse } from "../models/interfaces/Messages";
import React from 'react';
import { formatDate } from "../utils/FormatDate";

interface MessageListProps {
  messages: MessageResponse[];
  currentUserId: number
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-2">
      {messages.length === 0 ? (
        <div className="text-gray-500 text-sm">No messages yet</div>
      ) : (
        messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-xs break-words ${
                isMine ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {!isMine && (
                <img
                  src={msg.sender.avatarUrl?msg.sender.avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.userName)}&background=random`}
                  alt={msg.sender.userName}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
              <div
                className={`p-2 rounded text-shadow-2xs shadow-sm whitespace-pre-wrap break-words ${
                  isMine
                    ? 'bg-amber-100 text-black rounded-br-none'
                    : 'bg-white text-gray-700 rounded-bl-none'
                }`}
              >
                <div>{msg.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    isMine ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  {formatDate(msg.sendAt)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
