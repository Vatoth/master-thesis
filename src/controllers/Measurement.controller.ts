import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Measurement } from "../models/Measurement.model";

export interface IMeasurement {
  invocation: number;
  iteration: number;
  criterion: number;
  trialid: number;
  runid: number;
  value: number;
}

@Route("measurements")
@Tags("Measurement")
export class MeasurementController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getMeasurement(id: number): Promise<IMeasurement | null> {
    return await Measurement.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getMeasurements(): Promise<IMeasurement[]> {
    return await Measurement.findAll();
  }
}
