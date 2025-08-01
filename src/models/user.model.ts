import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Conversation } from "./conversation.model";
import { Role } from "./role.model";
import { UserConversation } from "./userconversation.model";
import { UserRoles } from "./userroles.model";
import { UserAttributes, UserCreationAttributes } from "../interfaces/user.interface";

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
    @Column({type: DataType.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;
    
    @Column({type: DataType.STRING, allowNull: false})
    userName!: string;

    @Column({type: DataType.STRING, allowNull: false})
    email!: string;

    @Column({type: DataType.STRING, allowNull: false})
    passwordHash!: string;

    @Column({type:DataType.STRING, allowNull: true})
    avatarUrl?: string;

    @BelongsToMany(()=> User, ()=> UserRoles)
    roles!: Role[];

    @BelongsToMany(()=> Conversation, ()=> UserConversation)
    conversations!: Conversation[]
}