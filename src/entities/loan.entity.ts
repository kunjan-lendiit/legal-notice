import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { TEXT } from 'sequelize';
import { AutoPayEntity } from './auto.pay.entity';
import { EmiEntity } from './emi.entity';
import { PartialEntity } from './partial.entity';
import { UPIEntity } from './upi.entity';
import { registeredUsers } from './user.entity';
import { ManualAutoDebitEntity } from './manual.auto.debit';
import { RazorPaymentEntity } from './razorpayment.entity';
import { mandateEntity } from './mandate.entity';
import { esignEntity } from './esign.entity';
import { PaymentEntity } from './payment.entity';
import { disbursementEntity } from './disbursement.entity';
import { Residence } from './residence.entity';
import { loanPurpose } from './loan.purpose.entity';
import { employmentDetails } from './employment.entity';
import { userLoanDecline } from './loan.decline.entity';
import { BankingEntity } from './banking.entity';
import { admin } from './admin.entity';
import { SubScriptionEntity } from './subscription.entity';

@Table({})
export class loanTransaction extends Model<loanTransaction> {
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

  @ForeignKey(() => employmentDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  empId: number;

  @ForeignKey(() => Residence)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  residenceId: number;

  @ForeignKey(() => loanPurpose)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  purposeId: number;

  @ForeignKey(() => userLoanDecline)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declineId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Reason of user for declining loan',
  })
  userReasonDecline: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'User asked the amount',
  })
  loanAmount: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  interestRate: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1', '2', '3', '4'],
    allowNull: false,
  })
  durationType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  duration: string;

  @Column({
    type: DataType.ENUM,
    values: ['InProcess', 'Accepted', 'Active', 'Rejected', 'Complete'],
    allowNull: false,
  })
  loanStatus: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dueDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  score: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'App Score Approved Amount',
  })
  approvedLoanAmount: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  approvedDuration: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  TotalRepayAmount: string;

  @Column({
    type: DataType.ARRAY(TEXT),
    allowNull: true,
  })
  softApproval: any;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  loanFees: number;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    allowNull: true,
  })
  workEmailStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  otp: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  loanRejectReason: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  netScore: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  netApprovedAmount: string;

  @Column({
    type: DataType.ARRAY(TEXT),
    allowNull: true,
  })
  netEmiData: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  netSoftApproval: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment:
      "Foreign key of netbanking user. Can't do it directly because other database",
  })
  netbankingId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment:
      '0=Loan Not Disbursed, 1=Loan Disbursed,2=Loan Disbursement Initialized',
  })
  loan_disbursement: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  loan_disbursement_date: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  perday: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  repaidAmount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fullRepaidDone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify softApprovalData',
  })
  softApprovalData: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON.stringify netApprovalData',
  })
  netApprovalData: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  loanRejectDate: string;

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

  @HasOne(() => esignEntity)
  eSignData: esignEntity;

  @ForeignKey(() => disbursementEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  loan_disbursement_id: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  stampFees: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalScore: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  applicationGrade: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  netbankingGrade: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    values: ['0', '1', '2'],
    comment: '0=pending, 1=Accepted,2=Rejected',
  })
  softApprovalFlag: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  activeDeviceId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  remark: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  adminName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  loanRejectBy: string;

  @BelongsTo(() => loanPurpose, {
    foreignKey: 'purposeId',
    targetKey: 'id',
    constraints: false,
  })
  purpose: loanPurpose;

  @BelongsTo(() => userLoanDecline, {
    foreignKey: 'declineId',
    targetKey: 'id',
    constraints: false,
  })
  userDecline: userLoanDecline;

  @BelongsTo(() => Residence, {
    foreignKey: 'residenceId',
    targetKey: 'id',
    constraints: false,
  })
  residence: Residence;

  @BelongsTo(() => employmentDetails, {
    foreignKey: 'empId',
    targetKey: 'id',
    constraints: false,
  })
  employment: employmentDetails;

  @BelongsTo(() => registeredUsers, {
    foreignKey: 'userId',
    targetKey: 'id',
    constraints: false,
  })
  registeredUsers: registeredUsers;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '-1',
    values: ['-1', '0', '1', '2', '3'],
  })
  manualVerification: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  manualVerificationAcceptId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  manualVerificationAcceptName: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: true,
  })
  uniqueId: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  processingFees: number;

  @ForeignKey(() => admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  followerId: number;

  @BelongsTo(() => admin)
  followerData: admin;

  @ForeignKey(() => BankingEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  bankingId: number;

  @BelongsTo(() => BankingEntity)
  bankingData: BankingEntity;

  @ForeignKey(() => SubScriptionEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  subscriptionId: number;

  @BelongsTo(() => SubScriptionEntity)
  subscriptionData: SubScriptionEntity;

  @HasMany(() => disbursementEntity)
  disbursementData: disbursementEntity[];

  @HasMany(() => EmiEntity)
  emiData: EmiEntity[];

  @HasMany(() => PaymentEntity)
  paymentData: PaymentEntity[];

  @HasMany(() => UPIEntity)
  upiData: UPIEntity[];

  @HasMany(() => AutoPayEntity)
  autoPayData: AutoPayEntity[];

  @HasMany(() => PartialEntity)
  partialData: PartialEntity[];

  @HasMany(() => ManualAutoDebitEntity)
  manulAutoPayData: ManualAutoDebitEntity[];

  @HasMany(() => RazorPaymentEntity)
  paylinkData: RazorPaymentEntity[];

  @HasMany(() => mandateEntity)
  mandateData: mandateEntity[];
}
