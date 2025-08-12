import type { IConversationResponse } from "../interfaces/Conversation";


export type SidebarProps = {
  conversations: IConversationResponse[];
  selectedId: number|null;
  onSelect: (id: number) => void;
  isMobileOpen?: boolean; // optional for mobile toggle
};
