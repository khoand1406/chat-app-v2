export class ConversationResponse{
    id!: number
    Name?: string
    isGroup!: boolean
    createdAt!: Date
    displayname?: string
    avatarUrl?: string
    lastMessage?:string
    timestamp?: string
    lastUserSent?: number
    lastUserName?: string
    

    constructor(conversation: any, displayName: string = '', avatarUrl: string = '', lastmessage: string= '', timesta: string= '', username: number=0, name: string= ''){
        this.id= conversation.id,
        this.Name= conversation.name,
        this.isGroup= conversation.isGroup,
        this.createdAt= conversation.createdAt
        this.displayname= displayName;
        this.avatarUrl= conversation.avatarUrl || avatarUrl || '';
        this.lastMessage= lastmessage|| '';
        this.timestamp= timesta;
        this.lastUserSent= username;
        this.lastUserName= name;
        
    }
}

export class groupCreateRequest{
    name!: string
    participantIds!: number[]
    isGroup= true
    createAt!: Date
    avatarUrl?: string
    constructor(model: any, avatarUrl: string= ''){
        this.name= model.name;
        this.participantIds= model.participantIds;
        this.createAt= model.createAt;
        this.avatarUrl= avatarUrl;
        
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
