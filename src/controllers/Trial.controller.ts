import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Trial } from "../models/Trial.model";
import { ITimeline } from "./Timeline.controller";

export interface ITrial {
  id: number;
  manualrun?: boolean;
  starttime?: Date;
  endtime?: Date;
  username?: string;
  envid?: number;
  sourceid?: number;
  expid?: number;
}

@Route("trials")
@Tags("Trial")
export class TrialController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getTrial(id: number): Promise<ITrial | null> {
    return await Trial.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get("{id}/measurements")
  public async getTrialMeasurements(id: number): Promise<ITrial | null> {
    const trial = await Trial.findByPk(id);
    return await trial.getMeasurements();
  }

  @SuccessResponse("200", "OK")
  @Get("{id}/timelines")
  public async getTrialTimelines(id: number): Promise<ITimeline | null> {
    const trial = await Trial.findByPk(id);
    return await trial.getTimelines();
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getTrials(): Promise<ITrial[]> {
    return await Trial.findAll();
  }
}
