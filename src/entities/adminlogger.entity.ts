import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({})
export class AdminloggerEntity extends Model<AdminloggerEntity> {
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
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  api: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  page: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  platform: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  browser: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  action: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  body: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  headers: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  query: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  params: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  hostname: string;
}
