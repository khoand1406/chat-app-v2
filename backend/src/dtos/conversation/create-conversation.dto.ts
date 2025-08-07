export class ConversationResponse{
    id!: number
    Name?: string
    isGroup!: boolean
    createdAt!: Date
    displayname?: string

    constructor(conversation: any, displayname: string = ''){
        this.id= conversation.id,
        this.Name= conversation.name,
        this.isGroup= conversation.isGroup,
        this.createdAt= conversation.createdAt
        this.displayname= displayname;
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

    constructor(model:any, currentUserId: number = 0, userReceiverName: string = ''){
        this.participantIds= model.participantIds;
        this.createdAt= model.createdAt;
        if(currentUserId > 0){
            this.participantIds.push(currentUserId);
        }
        if(userReceiverName){
            this.name= userReceiverName;
        }

    }
    
}

export class userConversationCreateRequest{
    participantId!: number
    isGroup= false
    createdAt!: Date
    constructor(model:any){
        this.participantId= model.participantId
        this.createdAt= new Date();

    }

}
