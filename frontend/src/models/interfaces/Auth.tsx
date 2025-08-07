export interface ILoginRequest{
    email: string;
    passwordHash: string;
}

export interface IUserRole {
  id: number;
  userId: number;
  roleId: number;
}

export interface IRole {
  id: number;
  roleName: string;
  UserRoles: IUserRole;
}

export interface IUser {
  id: number;
  userName: string;
  email: string;
  avatarUrl: string | null;
  roles: IRole[];
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}