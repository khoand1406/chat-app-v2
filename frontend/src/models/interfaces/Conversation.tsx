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
  participantsId: number[],
  createdAt:Date
}

export interface IGroupConversationCreateRequest{
  name: string
  participantsId: number[]
  isGroup:boolean
  createdAt: Date

}
