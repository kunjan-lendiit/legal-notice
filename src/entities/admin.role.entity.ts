import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({})
export class adminRole extends Model<adminRole> {
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
  roleName: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    comment: '0 fo pending 1 for done.',
  })
  isActive: string;
}
