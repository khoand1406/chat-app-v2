export interface UserResponse{
    id: number
    userName:string
    email: string
    roles: Role[]
    avatarUrl: string
    
}

export interface Role{
    id: number;
    roleName: string;
    UserRoles: UserRole;
}

export interface UserRole{
    id: number;
    userId: number;
    roleId: number;
}

export interface IRegisterUser{
    username: string
    email: string
    passwordHash: string
}

export interface IRegisterResponse{
    id:number
    userName:string
    email:string
    avatarUrl?: string
}