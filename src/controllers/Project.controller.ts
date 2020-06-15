import { Get, Tags, Route, Controller, SuccessResponse } from "tsoa";
import { Project } from "../models/Project.model";
import { IExperiment } from "./Experiment.controller";

export interface IProject {
  id: number;
  name?: string;
  description?: string;
  logo?: string;
  showchanges?: boolean;
  allresults?: boolean;
}

@Route("projects")
@Tags("Project")
export class ProjectController extends Controller {
  @SuccessResponse("200", "OK")
  @Get("{id}")
  public async getProject(id: number): Promise<IProject | null> {
    return await Project.findByPk(id);
  }

  @SuccessResponse("200", "OK")
  @Get("{id}/experiments")
  public async getProjectExperiment(id: number): Promise<IExperiment | null> {
    const project = await Project.findByPk(id);
    console.log(await project.getExperiments());
    return await project.getExperiments();
  }

  @SuccessResponse("200", "OK")
  @Get()
  public async getProjects(): Promise<IProject[]> {
    return await Project.findAll();
  }
}
