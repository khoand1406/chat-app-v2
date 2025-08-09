import type { MessageResponse } from "../interfaces/Messages"

export interface ChatWindowProps  {
    conversationId: number
    messages: MessageResponse[]
    currentUserId: number
    displayName: string;
    avatarUrl:string
}

export interface MessageInputProps{
    conversationId:number
}