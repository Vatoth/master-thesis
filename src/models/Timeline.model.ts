import {
  Column,
  PrimaryKey,
  Model,
  Table,
  ForeignKey,
  AllowNull,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import { Criterion } from "./Criterion.model";
import { Run } from "./Run.model";
import { Trial } from "./Trial.model";

@Table({ tableName: "timeline" })
export class Timeline extends Model<Timeline> {
  @AllowNull(true)
  @Column(DataType.INTEGER)
  numsamples?: number;

  @AllowNull(true)
  @Column(DataType.REAL)
  minval?: number;

  @AllowNull(true)
  @Column(DataType.REAL)
  maxval?: number;

  @AllowNull(true)
  @Column(DataType.REAL)
  sdval?: number;

  @AllowNull(true)
  @Column(DataType.REAL)
  mean?: number;

  @AllowNull(true)
  @Column(DataType.REAL)
  median?: number;

  @AllowNull(true)
  @Column(DataType.REAL)
  bci95low?: number;

  @AllowNull(true)
  @Column(DataType.REAL)
  bci95up?: number;

  @PrimaryKey
  @AllowNull(true)
  @ForeignKey(() => Criterion)
  @Column(DataType.INTEGER)
  criterion: number;

  @PrimaryKey
  @AllowNull(true)
  @ForeignKey(() => Run)
  @Column(DataType.INTEGER)
  runid: number;

  @PrimaryKey
  @AllowNull(true)
  @ForeignKey(() => Trial)
  @Column(DataType.INTEGER)
  trialid: number;

  @BelongsTo(() => Criterion, "criterion")
  acriterion: Criterion;

  @BelongsTo(() => Run, "runid")
  run: Run;

  @BelongsTo(() => Trial, "trialid")
  trial: Trial;
}
