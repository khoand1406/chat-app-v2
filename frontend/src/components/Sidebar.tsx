import classNames from "classnames";
import React, { useState } from "react";
import type { SidebarProps } from "../models/props/SidebarProps";
import { Plus, Search } from "lucide-react";
import CreateGroupModal from "./ConversationForm";
import { createGroupConversations, createUserConversation } from "../services/conversationServices";
import { toast } from "react-toastify";
import type { IUserConversationCreateRequest } from "../models/interfaces/Conversation";

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  isMobileOpen,
}) => {
  const personalConversations = conversations.filter((conv) => !conv.isGroup);
  const groupConversations = conversations.filter((conv) => conv.isGroup);

  const [showConversations, setShowConversations] = useState(true);
  const [showGroups, setShowGroups] = useState(true);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);

  const filteredPersonal = personalConversations.filter((conv) =>
  (conv.displayname ?? "").toLowerCase().includes(searchTerm.toLowerCase())
);
const filteredGroups = groupConversations.filter((conv) =>
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
                    conv.displayname? conv.displayname: ''
                  )}&background=random`
            }
            alt={conv.displayname}
            className="w-6 h-6 rounded-full object-cover border border-gray-300"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                conv.displayname? conv.displayname: ''
              )}&background=random`;
            }}
          />
          <span className="truncate text-xs">{conv.displayname}</span>
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
      // Group
      const response = await createGroupConversations(formData);
      if (!response) {
        toast("Invalid request! Try Again");
        return false;
      }
      setCreateOpen(false)
      onSelect(response.id);
      return true;
    } else {
      // 1-1
      const payload: IUserConversationCreateRequest = {
        participantId: parseInt(formData.get("participantId") as string),
        createdAt: new Date()
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
        "bg-gray-100 border-r border-gray-300 h-full w-64 flex-shrink-0 overflow-y-auto z-10",
        "md:block",
        {
          hidden: !isMobileOpen,
          "block absolute left-0 top-0 md:relative": isMobileOpen,
        }
      )}
    >
      <div className="p-4 text-xl fondivold border-b border-gray-300 bg-white flex items-center">
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
      
      <CreateGroupModal onSubmit={handleCreateGroup} isOpen= {isCreateOpen} onClose= {() => setCreateOpen(false)} />
      {/* Conversations */}
      <div>
        <button
          onClick={() => setShowConversations(!showConversations)}
          className="w-full text-left px-4 py-2 font-semibold text-gray-600 hover:bg-gray-200 flex justify-between items-center"
        >
          <span>Conversations</span>
          <span>{showConversations ? "▾" : "▸"}</span>
        </button>
        {showConversations &&
          (filteredPersonal.length > 0 ? (
            renderConversationList(filteredPersonal)
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">
              No conversations
            </div>
          ))}
      </div>

      {/* Groups */}
      <div>
        <button
          onClick={() => setShowGroups(!showGroups)}
          className="w-full text-left px-4 py-2 font-semibold text-gray-600 hover:bg-gray-200 flex justify-between items-center"
        >
          <span>Groups</span>
          <span>{showGroups ? "▾" : "▸"}</span>
        </button>
        {showGroups &&
          (filteredGroups.length > 0 ? (
            renderConversationList(filteredGroups)
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">No groups</div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;


