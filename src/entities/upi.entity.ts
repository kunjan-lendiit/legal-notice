import { EmiEntity } from './emi.entity';
import { loanTransaction } from './loan.entity';
import { registeredUsers } from './user.entity';
import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { BelongsTo, Column, DataType } from 'sequelize-typescript';
import { admin } from './admin.entity';

@Table({})
export class UPIEntity extends Model<UPIEntity> {
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
    unique: true,
  })
  transactionId: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'INITIATED, PROCESSING, SUCCESS, FAILURE',
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  completionDate: string;

  @ForeignKey(() => EmiEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  emiId: number;

  @ForeignKey(() => loanTransaction)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  loanId: number;

  @BelongsTo(() => loanTransaction, {
    foreignKey: 'loanId',
    targetKey: 'id',
    constraints: false,
  })
  loanData: loanTransaction;

  @ForeignKey(() => registeredUsers)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string;

  @BelongsTo(() => registeredUsers, {
    foreignKey: 'userId',
    targetKey: 'id',
    constraints: false,
  })
  registeredUsers: registeredUsers;

  @ForeignKey(() => admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  adminId: number;

  @BelongsTo(() => admin)
  admin: admin;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'gPay, phonePe, paytm, bhim',
  })
  upiApp: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  vpa: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  utr: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response: string;
}
