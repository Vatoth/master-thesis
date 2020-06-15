import {
  Column,
  PrimaryKey,
  Model,
  Table,
  AllowNull,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "schemaversion" })
export class SchemaVersion extends Model<SchemaVersion> {
  @AllowNull(true)
  @Column(DataType.DATE)
  updatedate?: Date;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.SMALLINT)
  version: number;
}
