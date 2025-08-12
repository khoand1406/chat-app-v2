import type { MessageResponse } from "../models/interfaces/Messages";
import React from 'react';
import { formatDate } from "../utils/FormatDate";

interface MessageListProps {
  messages: MessageResponse[];
  currentUserId: number
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const getLastSeenMap = (messages: MessageResponse[]) => {
  const lastSeenMap: Record<number, number> = {};

  messages.forEach((msg) => {
    msg.seenBy.forEach((seen) => {
      lastSeenMap[seen.id] = msg.id;
    });
  });

  return lastSeenMap;
};
  const lastSeenMap = getLastSeenMap(messages);

  return (
    <div className="space-y-2">
      {messages.length === 0 ? (
        <div className="text-gray-500 text-sm">No messages yet</div>
      ) : (
        messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          const seenUsersForThisMsg = msg.seenBy.filter(
            (u) => lastSeenMap[u.id] === msg.id
          );

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-xs break-words ${
                isMine ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              {!isMine && (
                <img
                  src={
                    msg.user?.avatarUrl
                      ? msg.user.avatarUrl
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          msg.user?.userName || "name"
                        )}&background=random`
                  }
                  alt={msg.user.userName}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
              <div
                className={`p-2 rounded text-shadow-2xs shadow-sm whitespace-pre-wrap break-words ${
                  isMine
                    ? "bg-amber-100 text-black rounded-br-none"
                    : "bg-white text-gray-700 rounded-bl-none"
                }`}
              >
                <div>{msg.content}</div>
                <div className="text-xs mt-1 text-gray-400">
                  {formatDate(msg.sendAt)}
                </div>

                
                {seenUsersForThisMsg.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {seenUsersForThisMsg.map((u) => (
                      <img
                        key={u.id}
                        src={
                          u.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            u.userName
                          )}&background=random`
                        }
                        alt={u.userName}
                        title={`Seen at ${new Date(
                          u.readAt
                        ).toLocaleString()}`}
                        className="w-4 h-4 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList