export interface UserResponse{
    id: number
    userName:number
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