import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { registeredUsers } from './user.entity';
import { loanTransaction } from './loan.entity';

@Table({})
export class PaylinkEntity extends Model<PaylinkEntity> {
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
  accept_partial: boolean;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  amount: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  amount_paid: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  callback_method: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  callback_url: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  cancelled_at: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  created_at: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  currency: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  customer: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  expire_by: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  expired_at: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  first_min_partial_amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  pay_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify',
  })
  payments: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reference_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  short_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  status: string;

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
