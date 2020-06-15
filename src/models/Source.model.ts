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

@Table({ tableName: "source" })
export class Source extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  repourl?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  branchortag?: string;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING)
  commitid?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  commitmessage?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  authorname?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  authoremail?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  committername?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  committeremail?: string;

  @HasMany(() => Trial, "sourceid")
  trials: Trial[];
}
