export interface IConversationResponse {
  id: number
  Name?: string
  isGroup: boolean
  createdAt: Date
  displayname?: string
  avatarUrl?: string
  lastMessage?:string
  timestamp?: string
  unreadCount: number
  lastUserSent?:number
  lastUserName?:string
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
