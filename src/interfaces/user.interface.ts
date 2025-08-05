import { Optional } from 'sequelize';
export interface UserAttributes {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'avatarUrl' | 'createdAt' | 'updatedAt'
>;

