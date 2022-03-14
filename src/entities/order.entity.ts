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
export class OrderEntity extends Model<OrderEntity> {
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
  order_id: string;

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
    type: DataType.DOUBLE,
    allowNull: true,
  })
  amount_due: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  currency: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  attempts: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify',
  })
  response: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify',
  })
  options: string;

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
