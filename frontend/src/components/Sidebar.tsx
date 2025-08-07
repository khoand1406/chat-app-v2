import classNames from 'classnames';
import React from 'react';
import type { SidebarProps } from '../models/props/SidebarProps';


const Sidebar: React.FC<SidebarProps> = ({ conversations, selectedId, onSelect, isMobileOpen }) => {

  

  return (
    <div
      className={classNames(
        'bg-gray-100 border-r border-gray-300 h-full w-64 flex-shrink-0 overflow-y-auto z-10',
        'md:block', // visible on md+
        {
          hidden: !isMobileOpen,
          'block absolute left-0 top-0 md:relative': isMobileOpen, // mobile overlay
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
              'px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-all',
              selectedId === conv.id ? 'bg-gray-300 font-semibold' : ''
            )}
          >
            <div className="flex justify-between">
              <span>{conv.name}</span>
              {/* <span className="text-sm text-gray-500">{conv.timestamp}</span> */}
            </div>
            {/* <div className="text-sm text-gray-600 truncate">{conv.lastMessage}</div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
