import { Sequelize } from "sequelize-typescript";
import { Benchmark } from "../models/Benchmark.model";
import { Criterion } from "../models/Criterion.model";
import { Environment } from "../models/Environment.model";
import { Executor } from "../models/Executor.model";
import { Experiment } from "../models/Experiment.model";
import { Measurement } from "../models/Measurement.model";
import { Project } from "../models/Project.model";
import { Run } from "../models/Run.model";
import { SchemaVersion } from "../models/SchemaVersion.model";
import { SoftwareUse } from "../models/SoftwareUse.model";
import { SoftwareVersionInfo } from "../models/SoftwareVersionInfo.model";
import { Source } from "../models/Source.model";
import { Suite } from "../models/Suite.model";
import { Timeline } from "../models/Timeline.model";
import { Trial } from "../models/Trial.model";
import { Unit } from "../models/Unit.model";

export const database = new Sequelize({
  database: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  dialect: "postgres",
  username: "postgres",
  password: process.env.POSTGRES_PASSWORD || "test",
  define: {
    timestamps: false,
  },
});

database.addModels([
  Benchmark,
  Criterion,
  Environment,
  Executor,
  Experiment,
  Measurement,
  Project,
  Run,
  SchemaVersion,
  SoftwareUse,
  SoftwareVersionInfo,
  Source,
  Suite,
  Timeline,
  Trial,
  Unit,
]);
