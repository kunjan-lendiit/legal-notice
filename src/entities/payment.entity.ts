import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { loanTransaction } from './loan.entity';
import { registeredUsers } from './user.entity';

@Table({})
export class PaymentEntity extends Model<PaymentEntity> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  payment_id: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  order_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  method: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  card_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bank: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  wallet: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  vpa: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  contact: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  fee: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  tax: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify',
  })
  card: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify',
  })
  acquirer_data: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify',
  })
  response: string;

  @ForeignKey(() => registeredUsers)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => loanTransaction)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  loanId: number;

  @BelongsTo(() => registeredUsers)
  user: registeredUsers;

  @BelongsTo(() => loanTransaction)
  loan: loanTransaction;
}
