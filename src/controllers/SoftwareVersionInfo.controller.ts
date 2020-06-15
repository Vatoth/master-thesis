import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { SoftwareVersionInfo } from "../models/SoftwareVersionInfo.model";

export interface ISoftwareVersionInfo {
  id: number;
  name?: string;
  description?: string;
}

@Route("software-version-infos")
@Tags("SoftwareVersionInfo")
export class SoftwareVersionInfoController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getSoftwareVersionInfo(
    id: number
  ): Promise<ISoftwareVersionInfo | null> {
    return await SoftwareVersionInfo.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getSoftwareVersionInfos(): Promise<ISoftwareVersionInfo[]> {
    return await SoftwareVersionInfo.findAll();
  }
}
