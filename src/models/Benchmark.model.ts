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

@Table({ tableName: "benchmark" })
export class Benchmark extends Model<Benchmark> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING)
  name?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  description?: string;

  @HasMany(() => Run, "benchmarkid")
  runs: Run[];
}
