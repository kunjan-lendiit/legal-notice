import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { admin } from './admin.entity';
import { loanTransaction } from './loan.entity';
import { registeredUsers } from './user.entity';

@Table({})
export class ChangeLogsEntity extends Model<ChangeLogsEntity> {
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

  @BelongsTo(() => registeredUsers)
  userData: registeredUsers;

  @ForeignKey(() => loanTransaction)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  loanId: number;

  @BelongsTo(() => loanTransaction)
  loanData: loanTransaction;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: '["Approval Amount"]',
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'data before change happen',
  })
  oldData: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'data after change happen',
  })
  newData: string;

  @ForeignKey(() => admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  adminId: number;

  @BelongsTo(() => admin)
  adminData: admin;
}
