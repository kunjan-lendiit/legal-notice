import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({})
export class NetHistoryEntity extends Model<NetHistoryEntity> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  netBankingId: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  loanId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bankStatement: string;
}
