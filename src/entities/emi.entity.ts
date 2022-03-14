import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { UPIEntity } from './upi.entity';
import { loanTransaction } from './loan.entity';
import { registeredUsers } from './user.entity';
import { PartialEntity } from './partial.entity';
import { AutoPayEntity } from './auto.pay.entity';
import { LegalNoticeEntity } from './notice.entity';
import { OrderEntity } from './order.entity';
import { mandateEntity } from './mandate.entity';
import { PaymentEntity } from './payment.entity';
import { esignEntity } from './esign.entity';
import { PaylinkEntity } from './paylink.entity';
import { RazorPaymentEntity } from './razorpayment.entity';
import { ManualAutoDebitEntity } from './manual.auto.debit';

@Table({})
export class EmiEntity extends Model<EmiEntity> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  emi_date: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emiDate: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  emi_amount: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '0=SDK Payment,1=Web Payment, 2=Auto Pay, 3=UPI',
  })
  payment_type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  payment_done_date: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1', '2'],
    comment: '0=Pending,1=Done,2=Rejected',
    allowNull: false,
    defaultValue: '0',
  })
  payment_status: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=Payment not Due,1=Payment Due',
    allowNull: true,
  })
  payment_due_status: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  penalty: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  penalty_days: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  short_url: string;

  @ForeignKey(() => RazorPaymentEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  linkId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment:
      "Foreign key of netbanking user. Can't do it directly because other database",
  })
  netbankingId: number;

  @ForeignKey(() => loanTransaction)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  loanId: number;

  @ForeignKey(() => mandateEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  mandate_id: number;

  @ForeignKey(() => esignEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  esign_id: number;

  @ForeignKey(() => registeredUsers)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => OrderEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  orderId: number;

  @ForeignKey(() => PaymentEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  paymentId: number;

  @ForeignKey(() => PaylinkEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  payLinkId: number;

  @ForeignKey(() => AutoPayEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  autoPayId: number;

  @ForeignKey(() => LegalNoticeEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  legalId: number;

  @ForeignKey(() => UPIEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  upiPayId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isPartPaymentOn: boolean;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  })
  partPaymentAmount: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  })
  partPaymentPenaltyAmount: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  })
  principalCovered: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  })
  interestCalculate: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '0',
  })
  partialStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  adminName: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  waiver: number;

  @ForeignKey(() => ManualAutoDebitEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  manualAutoPayId: number;

  @BelongsTo(() => registeredUsers)
  user: registeredUsers;

  @BelongsTo(() => loanTransaction)
  loan: loanTransaction;

  @BelongsTo(() => LegalNoticeEntity)
  legalData: LegalNoticeEntity;

  @BelongsTo(() => OrderEntity)
  order: OrderEntity;

  @BelongsTo(() => PaymentEntity)
  payment: PaymentEntity;

  @BelongsTo(() => mandateEntity)
  mandate: mandateEntity;

  @HasMany(() => UPIEntity, 'emiId')
  upiData: UPIEntity[];

  @HasMany(() => AutoPayEntity, 'emiId')
  autoPayData: AutoPayEntity[];

  @HasMany(() => RazorPaymentEntity, 'emiId')
  razorPayData: RazorPaymentEntity[];

  @HasMany(() => PartialEntity)
  partialData: PartialEntity[];
}
