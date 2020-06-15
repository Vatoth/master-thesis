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
  Default,
} from "sequelize-typescript";
import { Experiment } from "./Experiment.model";

@Table({ tableName: "project" })
export class Project extends Model<Project> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull
  @Unique
  @Column(DataType.STRING)
  name?: string;

  @AllowNull
  @Column(DataType.TEXT)
  description?: string;

  @AllowNull
  @Column(DataType.STRING)
  logo?: string;

  @AllowNull
  @Default(true)
  @Column(DataType.BOOLEAN)
  showchanges?: boolean;

  @AllowNull
  @Default(false)
  @Column(DataType.BOOLEAN)
  allresults?: boolean;

  @HasMany(() => Experiment, "projectid")
  experiments: Experiment[];
}
