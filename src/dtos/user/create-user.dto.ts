import { RoleEnum } from "../../constants/roleEnum";

export class CreateUserRequest{
    username!: string
    email!:string
    passwordHash!: string
    avatarUrl?: string
    role= RoleEnum.User;
    
}