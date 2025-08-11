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