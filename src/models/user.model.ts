import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserAttributes, UserCreationAttributes } from "../interfaces/user.interface";
import { Conversation } from "./conversation.model";
import { Message } from "./message.model";
import { UserConversation } from "./userconversation.model";
import { Role } from "./role.model";
import { UserRoles } from "./userroles.model";


@Table({ tableName: "Users" })
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    userName!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    passwordHash!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    avatarUrl?: string;

    
    @BelongsToMany(() => Role, () => UserRoles)
    roles!: Role[];

    @HasMany(() => Message)
    messages!: Message[];

    @BelongsToMany(() => Conversation, () => UserConversation)
    conversations!: Conversation[];
}


