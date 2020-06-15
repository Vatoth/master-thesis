import {
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  ForeignKey,
  AllowNull,
  DataType,
  Unique,
  HasMany,
  BelongsTo,
  Table,
} from "sequelize-typescript";
import { Benchmark } from "./Benchmark.model";
import { Suite } from "./Suite.model";
import { Executor } from "./Executor.model";
import { Measurement } from "./Measurement.model";
import { Timeline } from "./Timeline.model";

@Table({ tableName: "run" })
export class Run extends Model<Run> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Unique
  @AllowNull(true)
  @Column(DataType.TEXT)
  cmdline?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  location?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  varvalue?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  cores?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  inputsize?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  extraargs?: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  maxinvocationtime?: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  miniterationtime?: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  warmup?: number;

  @ForeignKey(() => Benchmark)
  @Column(DataType.INTEGER)
  benchmarkid?: number;

  @ForeignKey(() => Suite)
  @Column(DataType.INTEGER)
  suiteid?: number;

  @ForeignKey(() => Executor)
  @Column(DataType.INTEGER)
  execid?: number;

  @BelongsTo(() => Benchmark, "benchmarkid")
  benchmark: Benchmark;

  @BelongsTo(() => Suite, "suiteid")
  suite: Suite;

  @BelongsTo(() => Executor, "execid")
  executor: Executor;

  @HasMany(() => Measurement, "runid")
  measurements: Measurement;

  @HasMany(() => Timeline, "runid")
  timelines: Timeline;
}
