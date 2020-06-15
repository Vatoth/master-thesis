import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Timeline } from "../models/Timeline.model";

export interface ITimeline {
  numsamples?: number;
  minval?: number;
  maxval?: number;
  sdval?: number;
  mean?: number;
  median?: number;
  bci95low?: number;
  bci95up?: number;
  criterion: number;
  runid: number;
  trialid: number;
}

@Route("timelines")
@Tags("Timeline")
export class TimelineController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getTimeline(id: number): Promise<ITimeline | null> {
    return await Timeline.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getTimelines(): Promise<ITimeline[]> {
    return await Timeline.findAll();
  }
}
