import classNames from "classnames";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import type { IUserConversationCreateRequest } from "../models/interfaces/Conversation";
import type { SidebarProps } from "../models/props/SidebarProps";
import { createGroupConversations, createUserConversation } from "../services/conversationServices";
import { calculateTime } from "../utils/FormatDate";
import CreateGroupModal from "./ConversationForm";

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  isMobileOpen,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);

  const filteredList = conversations.filter((conv) =>
    (conv.displayname ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConversationList = (list: typeof conversations) => (
    <ul>
      {list.map((conv) => (
        <li
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={classNames(
            "px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-all flex items-center gap-3",
            selectedId === conv.id ? "bg-gray-300 font-semibold" : ""
          )}
        >
          <img
            src={
              conv.avatarUrl && conv.avatarUrl.trim() !== ""
                ? conv.avatarUrl
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    conv.displayname ?? ""
                  )}&background=random`
            }
            alt={conv.displayname}
            className="w-6 h-6 rounded-full object-cover border border-gray-300"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                conv.displayname ?? ""
              )}&background=random`;
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span
                className={classNames(
                  "truncate text-sm font-medium",
                  conv.unreadCount > 0 ? "font-bold" : "font-normal"
                )}
              >
                {conv.displayname}
              </span>

              {conv.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {conv.unreadCount}
                </span>
              )}
              {conv.timestamp && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {calculateTime(conv.timestamp)}
                </span>
              )}
            </div>
            {conv.lastMessage && (<span className="truncate text-xs text-gray-600">
              
              {conv.lastUserSent!==conv.displayname? "You": conv.lastUserSent}: {conv.lastMessage}
            </span>)}
            
          </div>
        </li>
      ))}
    </ul>
  );

  async function handleCreateGroup(formData: FormData): Promise<boolean> {
    try {
      if (!formData) {
        toast("Invalid field", { position: "top-right", hideProgressBar: true });
        return false;
      }
      if (formData.getAll("participantIds").length > 1) {
        const response = await createGroupConversations(formData);
        if (!response) {
          toast("Invalid request! Try Again");
          return false;
        }
        setCreateOpen(false);
        onSelect(response.id);
        return true;
      } else {
        const payload: IUserConversationCreateRequest = {
          participantId: parseInt(formData.get("participantId") as string),
          createdAt: new Date(),
        };
        const response = await createUserConversation(payload);
        if (!response) {
          console.log("Invalid request");
          return false;
        }
        setCreateOpen(false);
        onSelect(response.id);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <div
      className={classNames(
        "bg-gray-100 border-r border-gray-300 h-full w-80 flex-shrink-0 overflow-y-auto z-10",
        "md:block",
        {
          hidden: !isMobileOpen,
          "block absolute left-0 top-0 md:relative": isMobileOpen,
        }
      )}
    >
      <div className="p-4 text-xl font-bold border-b border-gray-300 bg-white flex items-center">
        <span>Chats</span>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-1 hover:bg-gray-200 rounded ml-auto"
        >
          <Search size={18} />
        </button>
        <button
          onClick={() => setCreateOpen(true)}
          className="ml-2 p-1 hover:bg-gray-200 rounded"
        >
          <Plus size={18} />
        </button>
      </div>

      {searchOpen && (
        <div className="p-2 border-b border-gray-200 bg-white">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <CreateGroupModal
        onSubmit={handleCreateGroup}
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* Gộp tất cả conversation + group */}
      <div>
        {filteredList.length > 0 ? (
          renderConversationList(filteredList)
        ) : (
          <div className="px-4 py-2 text-gray-400 text-sm">No chats</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;


