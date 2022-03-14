import { Table, Column, Model, DataType } from 'sequelize-typescript';
@Table
export class bank extends Model<bank>{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  bankName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  systemBankName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  bankCode: string;

  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    allowNull: false,
    comment: '0->Deactive, 1->Active'
  })
  statusFlag: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=disable,1=enable',
    allowNull: true,
    validate: {
      isIn: [['0', '1']],
    },
  })
  netBankingService: string;

  @Column({
    type: DataType.TEXT,
    comment: '0=disable,1=finbit,2=litt',
    allowNull: true,
    validate: {
      isIn: [['0', '1', '2']],
    },
  })
  pdfService: string;
}
