import {
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
  Table,
  Index,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Unique,
} from "sequelize-typescript";
import { Unit } from "./Unit.model";
import { Timeline } from "./Timeline.model";

@Table({ tableName: "criterion" })
export class Criterion extends Model<Criterion> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @Unique({name: 'criterion_name_unit_key', msg: null})
  @Column(DataType.STRING)
  name?: string;
  
  
  @AllowNull(true)
  @Unique({name: 'criterion_name_unit_key', msg: null})
  @ForeignKey(() => Unit)
  @Column(DataType.STRING)
  unit?: string;

  @BelongsTo(() => Unit, "unit")
  aunit: Unit;

  @HasMany(() => Timeline, "criterion")
  timelines: Timeline[];
}
