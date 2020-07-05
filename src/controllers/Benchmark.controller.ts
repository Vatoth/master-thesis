import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Benchmark } from "../models/Benchmark.model";
import { IExecutor } from "./Executor.controller";
import { IRun } from "./Run.controller";

export interface IBenchmark {
  id: number;
  name?: string;
  description?: string;
  logo?: string;
  showchanges?: boolean;
  allresults?: boolean;
}

@Route("benchmarks")
@Tags("Benchmark")
export class BenchmarkController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getBenchmark(id: number): Promise<IBenchmark | null> {
    return await Benchmark.findByPk(id);
  }

  @Get("{id}/executors")
  public async getBenchmarkExecutors(id: number): Promise<IExecutor[]> {
    const benchmark = await Benchmark.findByPk(id);
    return benchmark.getExecutors();
  }

  @Get("{id}/runs")
  public async getBenchmarkRuns(id: number): Promise<IRun[]> {
    const benchmark = await Benchmark.findByPk(id);
    return benchmark.getRuns();
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getBenchmarks(): Promise<IBenchmark[]> {
    return await Benchmark.findAll();
  }
}
