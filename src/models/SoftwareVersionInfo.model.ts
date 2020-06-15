import {
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  Table,
  Index,
  AllowNull,
  DataType,
  HasMany,
  Unique,
} from "sequelize-typescript";
import { SoftwareUse } from "./SoftwareUse.model";

@Table({ tableName: "softwareversioninfo" })
export class SoftwareVersionInfo extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Unique({ name: "softwareversioninfo_name_version_key", msg: null })
  @AllowNull(true)
  @Column(DataType.STRING)
  name?: string;

  @Unique({ name: "softwareversioninfo_name_version_key", msg: null })
  @AllowNull(true)
  @Column(DataType.STRING)
  version?: string;

  @HasMany(() => SoftwareUse, "softid")
  softwaresUse: SoftwareUse[];
}
