import { Role } from "../../models/role.model"

export class UserResponse{
    id!: number
    userName!:number
    email!: string
    roles!: Role[]
    avatarUrl?: string
    

    constructor(user: any){
        this.id= user.id,
        this.userName= user.userName,
        this.email= user.email,
        this.roles= user.roles,
        this.avatarUrl= user.avatarUrl
        
    }
}