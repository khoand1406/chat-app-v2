export interface IConversationResponse {
  id: number;
  name: string;
  isGroup: boolean;
  createdAt: Date;
  displayname:string;
  avatarUrl?: string;
  lastMessage?: string;
  timestamp?: Date
};

export interface IUserConversationCreateRequest{
  participantId: number,
  createdAt:Date
}

export interface IGroupConversationCreateRequest{
  name: string
  participantIds: number[]
  isGroup:boolean
  createdAt: Date
  avatarUrl?: string

}
