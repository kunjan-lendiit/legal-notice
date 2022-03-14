import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EmiEntity } from './emi.entity';
import { loanTransaction } from './loan.entity';
import { registeredUsers } from './user.entity';

@Table({})
export class TransactionEntity extends Model<TransactionEntity> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  paidAmount: number;

  @Column({
    type: DataType.ENUM,
    values: ['INITIALIZED', 'COMPLETED', 'FAILED'],
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  completionDate: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  transactionId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  utr: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  source: string;

  @Column({
    type: DataType.ENUM,
    values: ['FULLPAY', 'EMIPAY', 'PARTPAY'],
    allowNull: false,
  })
  type: string;

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

  @ForeignKey(() => EmiEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  emiId: number;

  @BelongsTo(() => EmiEntity)
  emiData: EmiEntity;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  })
  principalAmount: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  })
  interestAmount: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  })
  penaltyAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subSource: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response: string;
}
