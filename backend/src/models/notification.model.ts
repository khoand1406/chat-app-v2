import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({tableName: "Notification", timestamps: false})
export class Notification extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Column({type: DataType.STRING, allowNull: false})
    title!:string

    @Column({type:DataType.STRING, allowNull: false})
    content!:string

    @Column({type:DataType.BOOLEAN, allowNull:false})
    isRead!: boolean

    @ForeignKey(()=> User)
    @Column({type:DataType.INTEGER, allowNull: false})
    userId!: number

    @Column({ type: DataType.STRING, allowNull: false })
    type!: string;

  // Nếu thông báo liên quan đến event -> lưu eventId
    @Column({ type: DataType.INTEGER, allowNull: true })
    eventId!: number | null;

    @Column({type: DataType.STRING, allowNull: true})
    status!: string | null

    @BelongsTo(()=> User)
    user!: User

    @Column({type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW})
    createdAt!:Date;

}