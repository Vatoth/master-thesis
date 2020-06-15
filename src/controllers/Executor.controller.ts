import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Executor } from "../models/Executor.model";

export interface IExecutor {
  id: number;
  name?: string;
  description?: string;
}

@Route("executors")
@Tags("Executor")
export class ExecutorController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getExecutor(id: number): Promise<IExecutor | null> {
    return await Executor.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getExecutors(): Promise<IExecutor[]> {
    return await Executor.findAll();
  }
}
