import { admin } from './admin.entity';
import { registeredUsers } from './user.entity';
import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { BelongsTo, Column, DataType } from 'sequelize-typescript';

@Table({})
export class LinkedInEntity extends Model<LinkedInEntity> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  profileURL: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @ForeignKey(() => registeredUsers)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verifiedDate: string;

  @ForeignKey(() => admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  adminId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason: string;

  @BelongsTo(() => admin)
  adminData: admin;

  @BelongsTo(() => registeredUsers)
  userData: registeredUsers;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  response: string;
}
