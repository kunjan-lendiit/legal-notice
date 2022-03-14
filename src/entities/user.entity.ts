import { LinkedInEntity } from './linkedIn.entity';
import { ManualAutoDebitEntity } from './manual.auto.debit';
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { EmiEntity } from './emi.entity';
import { employmentDetails } from './employment.entity';
import { loanTransaction } from './loan.entity';
import { device } from './device.entity';

@Table({})
export class registeredUsers extends Model<registeredUsers> {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.ENUM,
    values: ['Male', 'Female', 'MALE', 'FEMALE'],
    allowNull: true,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    unique: true,
  })
  phone: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  otp: string;
  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
  })
  phoneStatusVerified: string;
  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
  })
  emailStatusVerified: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  token: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pin: string;
  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
  })
  pinStatusVerified: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  aadharNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  aadharDob: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  aadharAddress: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  aadharFrontImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  aadharBackImage: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=Document not Verified,1=Document Verified,2=Document Rejected',
    values: ['0', '1', '2'],
  })
  aadharStatusVerified: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  kycRejectReason: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  panNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  panImage: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=Document not Verified,1=Document Verified,2=Document Rejected',
    values: ['0', '1', '2'],
  })
  panStatusVerified: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  IsActiveLoan: boolean;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  Emi: number;

  @Column({
    type: DataType.ENUM,

    values: ['0', '1'],
    allowNull: true,
  })
  isSelfEmployed: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  NextDateForApply: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fcmToken: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  recentDeviceId: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1', '2'],
    comment: '0=Android 1=iOS 2=Web',
    allowNull: true,
  })
  typeOfDevice: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  genderConfidence: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  residenceAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment:
      '0=Document not Verified,1=Document Verified,2=Document Rejected,3 = Admin Verified',
    validate: {
      isIn: [['0', '1', '2', '3']],
    },
  })
  homeStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  homeProofImage: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  referenceIdAadhaar: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  transactionIdAadhaar: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  referenceIdPan: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  transactionIdPan: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  referenceIdOtherDocument: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  transactionIdOtherDocument: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  otherDocumentType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  otherDocumentFrontImage: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  otherDocumentBackImage: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  otherDocumentNumber: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=Document not Verified,1=Document Verified,2=Document Rejected',
    allowNull: true,
    validate: {
      isIn: [['0', '1', '2']],
    },
  })
  otherDocumentVerified: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=PG,1=Electricity Bill,2=Rent',
    allowNull: true,
    validate: {
      isIn: [['0', '1', '2']],
    },
  })
  homeProofType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  pinAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  typeAddress: string;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  pinAddresslatLong: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  aadharAddresslatLong: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  otherDocumentVerifiedDate: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  aadharName: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=Came for OTP,1=OTP came but not verified,2=OTP verified',
  })
  aadhaar_otp_status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  completedLoans: number;

  //temp image
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  tempImage: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=not Verified,1=Verified,2=Rejected',
    allowNull: true,
    validate: {
      isIn: [['0', '1', '2']],
    },
  })
  tempImageVerified: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  emailCode: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    validate: {
      isIn: [['0', '1', '2']],
    },
  })
  codeStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  codeStatusDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  residenceProofApproveByName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  kycApproveByName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: '0',
    values: ['0', '1', '2'],
  })
  isBlacklist: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  tempImageRejectReason: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  residenceRejectReason: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'city',
  })
  city: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'pincode',
  })
  pincode: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '0 for Salary is eligible for loan, 1 vice versa',
    values: ['0', '1'],
    defaultValue: '0',
  })
  salaryEligible: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '0=Not Enough,1=Enough 2=Rejected',
  })
  quantity_status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalContact: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  contactRejectReason: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  contactApproveBy: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isInterested: boolean;

  @HasMany(() => ManualAutoDebitEntity)
  manualAutoDebit: ManualAutoDebitEntity[];

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    defaultValue: 0.4,
  })
  interestRate: number;

  @HasMany(() => LinkedInEntity)
  linkedInData: LinkedInEntity[];

  @HasMany(() => EmiEntity)
  emiData: EmiEntity[];

  @HasOne(() => employmentDetails)
  employmentData: employmentDetails;

  @HasMany(() => loanTransaction)
  loanData: loanTransaction[];

  @HasMany(() => device)
  deviceData: device[];
}
