import { Get, Tags, Route, Controller, SuccessResponse, Query } from "tsoa";
import { Source } from "../models/Source.model";
import { ITrial } from "./Trial.controller";

export interface ISource {
  id: number;
  repourl?: string;
  branchortag?: string;
  commitid?: string;
  commitmessage?: string;
  authorname?: string;
  authoremail?: string;
  committername?: string;
  committeremail?: string;
}

@Route("sources")
@Tags("Source")
export class SourceController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getSource(id: number): Promise<ISource | null> {
    return await Source.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get("{id}/trials")
  public async getSourceTrials(id: number): Promise<ITrial | null> {
    const source = await Source.findByPk(id);
    return await source.getTrials();
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getSources(
    @Query() commitid: string = undefined
  ): Promise<ISource[]> {
    if (commitid === undefined) {
      return await Source.findAll();
    }
    return await Source.findAll({
      where: {
        commitid: commitid,
      },
    });
  }
}
