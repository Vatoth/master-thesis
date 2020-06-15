import {
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  Table,
  AllowNull,
  DataType,
  HasMany,
  Unique,
} from "sequelize-typescript";
import { Run } from "./Run.model";

@Table({ tableName: "executor" })
export class Executor extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING)
  name?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @HasMany(() => Run, "execid")
  runs: Run[];
}
