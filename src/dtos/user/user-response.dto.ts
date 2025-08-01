import { Role } from "../../models/role.model"

export class UserResponse{
    id!: number
    userName!:number
    email!: string
    roles!: Role[]

    constructor(user: any){
        this.id= user.id,
        this.userName= user.name,
        this.email= user.email,
        this.roles= user.roles
    }
}