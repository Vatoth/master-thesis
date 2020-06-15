import {
  Column,
  PrimaryKey,
  Model,
  Table,
  ForeignKey,
  DataType,
  BelongsTo,
  NotNull,
  AllowNull,
} from "sequelize-typescript";
import { Criterion } from "./Criterion.model";
import { Trial } from "./Trial.model";
import { Run } from "./Run.model";

@Table({ tableName: "measurement" })
export class Measurement extends Model<Measurement> {
  @PrimaryKey
  @Column(DataType.SMALLINT)
  invocation: number;

  @PrimaryKey
  @Column(DataType.INTEGER)
  iteration: number;

  @PrimaryKey
  @ForeignKey(() => Criterion)
  @Column(DataType.INTEGER)
  criterion: number;

  @PrimaryKey
  @ForeignKey(() => Trial)
  @Column(DataType.INTEGER)
  trialid: number;

  @PrimaryKey
  @ForeignKey(() => Run)
  @Column(DataType.INTEGER)
  runid: number;

  @AllowNull(false)
  @Column(DataType.REAL)
  value: number;

  @BelongsTo(() => Criterion, "criterion")
  acriterion: Criterion;

  @BelongsTo(() => Run, "runid")
  run: Run;

  @BelongsTo(() => Trial, "trialid")
  trial: Trial;
}
