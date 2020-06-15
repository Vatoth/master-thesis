import * as express from "express";
import * as bodyParser from "body-parser";
import * as swaggerUI from "swagger-ui-express";
import * as swaggerJSON from "./swagger.json";

import "./controllers/Project.controller";
import "./controllers/Experiment.controller";
import "./controllers/Unit.controller";
import "./controllers/Benchmark.controller";
import "./controllers/Criterion.controller";
import "./controllers/Environment.controller";
import "./controllers/Executor.controller";
import "./controllers/Suite.controller";
import "./controllers/Timeline.controller";
import "./controllers/Run.controller";
import "./controllers/Trial.controller";
import "./controllers/Measurement.controller";
import "./controllers/SchemaVersion.controller";
import "./controllers/Source.controller";
import "./controllers/SoftwareVersionInfo.controller";

import { RegisterRoutes } from "./routes";
import { database } from "./config/database";
import { ValidateError } from "tsoa";

database.sync();
class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use("/", swaggerUI.serve);
    this.app.get("/", swaggerUI.setup(swaggerJSON));

    this.app.use((
      err: unknown,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): express.Response | void => {
      if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
          message: "Validation Failed",
          details: err?.fields,
        });
      }
      if (err instanceof Error) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
      next();
    });

    RegisterRoutes(this.app);
  }
}

export default new App().app;
