import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({})
export class adminRoleModule extends Model<adminRoleModule> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: true,
  })
  allRoleViewId: number;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: true,
  })
  allRoleUpdateId: number[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roleModuleName: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    defaultValue: '1',
    comment: '0 for inactive 1 for active.',
  })
  isActive: string;
}
