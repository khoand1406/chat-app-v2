export interface MessageResponse{
    id: number
    conversationId: number
    senderId: number
    content: string
    sendAt: Date
    user: ISender
}

export interface IMessageRequest{
    conversationId: number
    sendAt:Date
    content: string
}

export interface ISender{
    id: number
    userName: string
    avatarUrl: string
}