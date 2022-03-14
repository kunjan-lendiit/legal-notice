import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { registeredUsers } from './user.entity';

@Table({})
export class ChatDocumentEntity extends Model<ChatDocumentEntity> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => registeredUsers)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  docUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  docType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  password: string;
}
