import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Suite } from "../models/Suite.model";
import { IRun } from "./Run.controller";

export interface ISuite {
  id: number;
  name?: string;
  description?: string;
}

@Route("suites")
@Tags("Suite")
export class SuiteController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getSuite(id: number): Promise<ISuite | null> {
    return await Suite.findByPk(id);
  }

  @Get("{id}/runs")
  public async getSuiteRuns(id: number): Promise<IRun[]> {
    const suite = await Suite.findByPk(id);
    return suite.getRuns();
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getSuites(): Promise<ISuite[]> {
    return await Suite.findAll();
  }
}
