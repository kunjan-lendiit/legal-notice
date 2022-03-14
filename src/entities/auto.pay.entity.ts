import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EmiEntity } from './emi.entity';
import { loanTransaction } from './loan.entity';
import { registeredUsers } from './user.entity';

@Table({})
export class AutoPayEntity extends Model<AutoPayEntity> {
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
  batchId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  mandateId: string;

  @ForeignKey(() => EmiEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  emiId: number;

  @Column({
    type: DataType.ENUM,
    values: ['1', '2', '3', '4'],
    comment: '1=Initiated, 2=In_Progress, 3=Success, 4=Failure',
    allowNull: true,
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  payment_done_date: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  signdesk_response: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    unique: true,
  })
  creationDate: string;

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
