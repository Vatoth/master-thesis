import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Environment } from "../models/Environment.model";

export interface IEnvironment {
  id: number;
  hostname?: string;
  ostype?: string;
  memory?: number;
  cpu?: string;
  clockspeed?: number;
  note?: string;
}

@Route("environments")
@Tags("Environment")
export class EnvironmentController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getEnvironment(id: number): Promise<IEnvironment | null> {
    return await Environment.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getEnvironments(): Promise<IEnvironment[]> {
    return await Environment.findAll();
  }
}
