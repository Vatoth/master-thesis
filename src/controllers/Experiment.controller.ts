import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Experiment } from "../models/Experiment.model";

export interface IExperiment {
  id: number;
  name: string;
  description?: string;
  projectid?: number;
}

@Route("experiments")
@Tags("Experiment")
export class ExperimentController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getExperiment(id: number): Promise<IExperiment | null> {
    return await Experiment.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getExperiments(): Promise<IExperiment[]> {
    return await Experiment.findAll();
  }
}
