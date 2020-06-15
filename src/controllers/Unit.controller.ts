import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Unit } from "../models/Unit.model";
import { ICriterion } from "./Criterion.controller";

export interface IUnit {
  id: number;
  name?: string;
  description?: string;
}

@Route("units")
@Tags("Unit")
export class UnitController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getUnit(id: number): Promise<IUnit | null> {
    return await Unit.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get("{id}/criterions")
  public async getUnitCriterions(id: number): Promise<ICriterion | null> {
    const unit = await Unit.findByPk(id);
    return await unit.getCriterions();
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getUnits(): Promise<IUnit[]> {
    return await Unit.findAll();
  }
}
