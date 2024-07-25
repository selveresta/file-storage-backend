import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  IsUUID,
} from 'sequelize-typescript';

@Table({
  tableName: 'files',
  timestamps: true,
})
export class File extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.INTEGER)
  size!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  downloadCount!: number;

  @Column(DataType.STRING)
  extension!: string;

  @Column(DataType.STRING)
  description?: string;
}
