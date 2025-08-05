import { RoleEnum } from "../../constants/roleEnum";

export class CreateUserRequest{
    username!: string
    email!:string
    passwordHash!: string
    avatarUrl?: string
    role= RoleEnum.User;
    
    constructor(data: any) {
    this.username = data.username;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.avatarUrl = data.avatarUrl;
    
  }

}