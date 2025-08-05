export class ConversationResponse{
    id!: number
    Name?: string
    isGroup!: boolean
    createdAt!: Date

    constructor(conversation: any){
        this.id= conversation.id,
        this.Name= conversation.name,
        this.isGroup= conversation.isGroup,
        this.createdAt= conversation.createdAt
    }
}

export class groupCreateRequest{
    name!: string
    participantIds!: number[]
    isGroup= true
    createAt!: Date
    constructor(model: any){
        this.name= model.name;
        this.participantIds= model.participantIds;
        this.createAt= model.createAt;
    }
}

export class conversationCreateRequest{
    name= ''
    participantIds!:number[]
    isGroup= false
    createdAt!:Date

    constructor(model:any){
        this.participantIds= model.participantIds;
        this.createdAt= model.createdAt;
    }
    
}
