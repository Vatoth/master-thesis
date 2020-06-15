export interface BulkData {
  env: Env;
  projectName: string;
  source: Source;
  startTime: Date;
  criteria: Criterion[];
  data: Datum[];
  experimentName: string;
}

export interface Criterion {
  i: number;
  c: string;
  u: string;
}

export interface Datum {
  runId: RunID;
  d: D[];
}

export interface D {
  m: M[];
  it: number;
  in: number;
}

export interface M {
  c: number;
  v: number;
}

export interface RunID {
  varValue: string | null;
  inputSize: null;
  benchmark: Benchmark;
  extraArgs: string;
  cmdline: string;
  location: string;
  cores: number;
}

export interface Benchmark {
  suite: Suite;
  name: string;
  runDetails: RunDetails;
}

export interface RunDetails {
  maxInvocationTime: number;
  minIterationTime: number;
  warmup: null;
}

export interface Suite {
  desc: null;
  name: string;
  executor?: Suite;
  build?: Build[];
}

export interface Build {
  cmd: string;
  location: string;
}

export interface Env {
  userName: string;
  hostName: string;
  manualRun: boolean;
  memory: number;
  osType: string;
  clockSpeed: number;
  cpu: string;
  software: Software[];
}

export interface Software {
  version: string;
  name: string;
}

export interface Source {
  commitId: string;
  committerName: string;
  commitMsg: string;
  authorName: string;
  committerEmail: string;
  repoURL: string;
  branchOrTag: string;
  authorEmail: string;
}
