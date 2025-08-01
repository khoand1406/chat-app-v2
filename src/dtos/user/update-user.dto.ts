import { Role } from "../../models/role.model";

export class UserUpdateRequest{
    username!: string
    email!:string
    passwordHash!: string
    avatarUrl?: string
    role!: Role[];
}