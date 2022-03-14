import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { adminRole } from './admin.role.entity';

@Table({})
export class admin extends Model<admin> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  jwtDetails: string;

  @ForeignKey(() => adminRole)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
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
    comment: '0 fo pending 1 for done.',
  })
  phoneStatusVerified: string;
  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    comment: '0 fo pending 1 for done.',
  })
  emailStatusVerified: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    comment: '0 fo Not Active 1 for Active.',
  })
  isActive: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  passwordExpireDate: any;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  collection: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  lending: string;
}
