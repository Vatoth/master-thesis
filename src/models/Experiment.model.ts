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
import { Project } from "./Project.model";
import { Trial } from "./Trial.model";

@Table({ tableName: "experiment" })
export class Experiment extends Model<Experiment> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @Unique({ name: "experiment_projectid_name_key", msg: null })
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(true)
  @Unique({ name: "experiment_projectid_name_key", msg: null })
  @ForeignKey(() => Project)
  @Column(DataType.INTEGER)
  projectid?: number;

  @BelongsTo(() => Project, "projectid")
  project: Project;

  @HasMany(() => Trial, "expid")
  trials: Trial[];
}
