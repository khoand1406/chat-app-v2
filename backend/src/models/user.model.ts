import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserAttributes, UserCreationAttributes } from "../interfaces/user.interface";
import { Conversation } from "./conversation.model";
import { Message } from "./message.model";
import { Role } from "./role.model";
import { UserConversation } from "./userconversation.model";
import { UserRoles } from "./userroles.model";
import { UserMessages } from "./usermessages";
import { Notification } from "./notification.model";
import { Attendance } from "./attendence.model";
import { Events } from "./event.model";

@Table({ tableName: "Users", timestamps: false })
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

    @Column({ type: DataType.DATE, allowNull: true })
    createdAt?: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    updatedAt?: Date;

    @BelongsToMany(() => Role, () => UserRoles)
    roles!: Role[];

    @HasMany(() => Message)
    messages!: Message[];

    @HasMany(()=> Notification)
    notifications!: Notification[]

    @BelongsToMany(() => Conversation, () => UserConversation)
    conversations!: Conversation[];

    @HasMany(() => UserMessages)
    readMessages!: UserMessages[];

    @HasMany(() => UserConversation)
    userconversations!: UserConversation[];

    @HasMany(()=> Attendance)
    attendences!: Attendance[]

    @HasMany(() => Events)
    events!: Events[];

    
}
