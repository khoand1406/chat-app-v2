import classNames from "classnames";
import React from "react";
import type { SidebarProps } from "../models/props/SidebarProps";

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  isMobileOpen,
}) => {
  return (
    <div
      className={classNames(
        "bg-gray-100 border-r border-gray-300 h-full w-64 flex-shrink-0 overflow-y-auto z-10",
        "md:block", // visible on md+
        {
          hidden: !isMobileOpen,
          "block absolute left-0 top-0 md:relative": isMobileOpen, // mobile overlay
        }
      )}
    >
      {/* Header */}
      <div className="p-4 text-xl font-bold border-b border-gray-300 bg-white">
        Conversations
      </div>

      {/* Conversation list */}
      <ul>
  {conversations.map((conv) => (
    <li
      key={conv.id}
      onClick={() => onSelect(conv.id)}
      className={classNames(
        'px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-all flex items-center gap-3',
        selectedId === conv.id ? 'bg-gray-300 font-semibold' : ''
      )}
    >
      <img
        src={
          conv.avatarUrl && conv.avatarUrl.trim() !== ""
            ? conv.avatarUrl
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.displayname)}&background=random`
        }
        alt={conv.displayname}
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.displayname)}&background=random`;
        }}
      />
      <span className="truncate">{conv.displayname}</span>
    </li>
  ))}
</ul>
    </div>
  );
};

export default Sidebar;
