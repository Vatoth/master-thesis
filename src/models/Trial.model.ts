import {
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  Table,
  Index,
  ForeignKey,
  AllowNull,
  DataType,
  BelongsTo,
  HasMany,
  Unique,
} from "sequelize-typescript";
import { Environment } from "./Environment.model";
import { Source } from "./Source.model";
import { Experiment } from "./Experiment.model";
import { Timeline } from "./Timeline.model";
import { Measurement } from "./Measurement.model";

@Table({ tableName: "trial" })
export class Trial extends Model<Trial> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @Column(DataType.BOOLEAN)
  manualrun?: boolean;

  @AllowNull(true)
  @Unique({ name: "trial_username_envid_starttime_key", msg: null })
  @Column(DataType.DATE)
  starttime?: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  endtime?: Date;

  @Unique({ name: "trial_username_envid_starttime_key", msg: null })
  @Column(DataType.STRING)
  username?: string;

  @Unique({ name: "trial_username_envid_starttime_key", msg: null })
  @Column(DataType.INTEGER)
  @ForeignKey(() => Environment)
  envid?: number;

  @Column(DataType.INTEGER)
  @ForeignKey(() => Source)
  sourceid?: number;

  @Column(DataType.INTEGER)
  @ForeignKey(() => Experiment)
  expid?: number;

  @BelongsTo(() => Environment, "envid")
  environment: Environment;

  @BelongsTo(() => Source, "sourceid")
  source: Source;

  @BelongsTo(() => Experiment, "expid")
  experiment: Experiment;

  @HasMany(() => Timeline, "trialid")
  timelines: Timeline[];

  @HasMany(() => Measurement, "trialid")
  measurements: Measurement[];
}
