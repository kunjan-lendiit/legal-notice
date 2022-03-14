import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { admin } from './admin.entity';

@Table({})
export class BankingEntity extends Model<BankingEntity> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandateAccount: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandateBank: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandateIFSC: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  disbursementAccount: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  disbursementBank: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  disbursementIFSC: string;

  @ForeignKey(() => admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  mandateAdminId: number;

  @ForeignKey(() => admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  disbursementAdminId: number;

  @BelongsTo(() => admin, {
    foreignKey: 'mandateAdminId',
    targetKey: 'id',
    constraints: false,
  })
  mandateAdminData: admin;

  @BelongsTo(() => admin, {
    foreignKey: 'disbursementAdminId',
    targetKey: 'id',
    constraints: false,
  })
  disbursementAdminData: admin;
}
