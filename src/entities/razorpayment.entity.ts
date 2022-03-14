import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EmiEntity } from './emi.entity';
import { registeredUsers } from './user.entity';
import { loanTransaction } from './loan.entity';

@Table({})
export class RazorPaymentEntity extends Model<RazorPaymentEntity> {
  @Column({
    autoIncrement: true,
    type: DataType.INTEGER,
    allowNull: true,
    primaryKey: true,
  })
  linkId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  invoiceId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'issued',
  })
  status: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  payment_time: number;

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

  @ForeignKey(() => registeredUsers)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string;

  @BelongsTo(() => EmiEntity)
  emi: EmiEntity;

  @BelongsTo(() => registeredUsers)
  user: registeredUsers;

  @BelongsTo(() => loanTransaction)
  loan: loanTransaction;
}
