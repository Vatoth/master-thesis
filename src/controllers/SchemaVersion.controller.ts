import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { SchemaVersion } from "../models/SchemaVersion.model";

export interface ISchemaVersion {
  updatedate?: Date;
  version: number;
}

@Route("schema-versions")
@Tags("SchemaVersion")
export class SchemaVersionController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getSchemaVersion(id: number): Promise<ISchemaVersion | null> {
    return await SchemaVersion.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getSchemaVersions(): Promise<ISchemaVersion[]> {
    return await SchemaVersion.findAll();
  }
}
