import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Run } from "../models/Run.model";
import { ITimeline } from "./Timeline.controller";
import { IMeasurement } from "./Measurement.controller";

export interface IRun {
  id: number;
  cmdline?: string;
  location?: string;
  varvalue?: string;
  cores?: string;
  inputsize?: string;
  extraargs?: string;
  maxinvocationtime?: number;
  miniterationtime?: number;
  warmup?: number;
  benchmarkid?: number;
  suiteid?: number;
  execid?: number;
}

@Route("runs")
@Tags("Run")
export class RunController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getRun(id: number): Promise<IRun | null> {
    return await Run.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get("{id}/timelines")
  public async getTrialTimelines(id: number): Promise<ITimeline[]> {
    const run = await Run.findByPk(id);
    return await run.getTimelines();
  }

  @SuccessResponse("200", "OK")
  @Get("{id}/measurements")
  public async getTrialMeasurements(id: number): Promise<IMeasurement[]> {
    const run = await Run.findByPk(id);
    return await run.getMeasurements();
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getRuns(): Promise<IRun[]> {
    return await Run.findAll();
  }
}
