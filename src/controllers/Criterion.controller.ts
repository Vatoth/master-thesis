import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Criterion } from "../models/Criterion.model";

export interface ICriterion {
  id: number;
  name?: string;
  unit?: string;
}

@Route("criterions")
@Tags("Criterion")
export class CriterionController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getCriterion(id: number): Promise<ICriterion | null> {
    return await Criterion.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getCriterions(): Promise<ICriterion[]> {
    return await Criterion.findAll();
  }
}
