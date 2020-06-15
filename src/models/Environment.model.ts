import {
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  Table,
  AllowNull,
  DataType,
  Unique,
  HasMany,
} from "sequelize-typescript";
import { Trial } from "./Trial.model";
import { SoftwareUse } from "./SoftwareUse.model";

@Table({ tableName: "environment" })
export class Environment extends Model<Environment> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING)
  hostname?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  ostype?: string;

  @AllowNull(true)
  @Column(DataType.BIGINT)
  memory?: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  cpu?: string;

  @AllowNull(true)
  @Column(DataType.BIGINT)
  clockspeed?: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  note?: string;

  @HasMany(() => Trial, "envid")
  trials: Trial[];

  @HasMany(() => SoftwareUse, "envid")
  softwaresUse: SoftwareUse[];
}
