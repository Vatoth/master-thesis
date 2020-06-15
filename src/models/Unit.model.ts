import {
  Column,
  PrimaryKey,
  Model,
  AllowNull,
  DataType,
  HasMany,
  Table,
} from "sequelize-typescript";
import { Criterion } from "./Criterion.model";

@Table({ tableName: "unit" })
export class Unit extends Model<Unit> {
  @PrimaryKey
  @Column(DataType.STRING)
  name: string;

  @AllowNull
  @Column(DataType.TEXT)
  description?: string;

  @AllowNull
  @Column(DataType.BOOLEAN)
  lessisbetter?: boolean;

  @HasMany(() => Criterion)
  criterions: Criterion;
}
