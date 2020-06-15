import {
  Column,
  PrimaryKey,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
  Table,
} from "sequelize-typescript";
import { Environment } from "./Environment.model";
import { SoftwareVersionInfo } from "./SoftwareVersionInfo.model";

@Table({ tableName: "softwareuse" })
export class SoftwareUse extends Model {
  @PrimaryKey
  @ForeignKey(() => Environment)
  @Column(DataType.INTEGER)
  envid: number;

  @PrimaryKey
  @ForeignKey(() => SoftwareVersionInfo)
  @Column(DataType.INTEGER)
  softid: number;

  @BelongsTo(() => SoftwareVersionInfo, "softid")
  softwareVersionInfo: SoftwareVersionInfo;

  @BelongsTo(() => Environment, "envid")
  environment: Environment;
}
