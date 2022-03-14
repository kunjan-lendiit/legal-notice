import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { registeredUsers } from './user.entity';

@Table({})
export class crmActivity extends Model<crmActivity> {
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

  @BelongsTo(() => registeredUsers, {
    foreignKey: 'userId',
    targetKey: 'id',
    constraints: false,
  })
  registeredUsers: registeredUsers;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1', '2', '3', '4'],
    comment:
      '0=Pre-calling collection, 1=Post-calling collection, 2=General, 3=Promise to pay, 4=Other ',
  })
  categoryId: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  due_date: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1', '2', '3'],
    comment: '0=in progress, 1=done, 2=reject, 3=pending',
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  lastUpdatedBy: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  read: boolean;
}
