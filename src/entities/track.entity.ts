import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { registeredUsers } from './user.entity';

@Table({})
export class trackUser extends Model<trackUser> {
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
  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  registerationStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  registerationDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  registerationAddress: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  employmentStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  employmentDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  employmentAddress: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  residenceStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  residenceDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  residenceAddress: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  softApprovalStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  softApprovalDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  softApprovalAddress: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  KYCStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  KYCDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  KYCAddress: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  netbankingStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  netbankingDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  netbankingAddress: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  emandateStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  emandateDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  emandateAddress: string;

  @Column({
    type: DataType.ENUM,
    comment: '0=not Verified,1=Verified,2=Rejected',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  esignStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  esignDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  esignAddress: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=pending,1=done,2=fail',
    values: ['0', '1', '2'],
    allowNull: true,
  })
  disbursedStatus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  disbursedDate: string;

  @BelongsTo(() => registeredUsers, {
    foreignKey: 'userId',
    targetKey: 'id',
    constraints: false,
  })
  registeredUsers: registeredUsers;
}
