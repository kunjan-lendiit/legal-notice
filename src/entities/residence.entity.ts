import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ timestamps: false })
export class Residence extends Model<Residence> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  residenceName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    allowNull: true,
  })
  residenceStatus: string;
}
