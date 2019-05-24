export type Scenario = {
  name: string;
  configuration: ScenarioConfiguration;
  steps: ScenarioStep[];
};

export type ExpectResultField = {
  name: string, assignToVar?: string
};

export type ExpectResult = {
  status?: number;
  fields?: [ ExpectResultField ];
};

export type ScenarioStep = {
  name: string;
  description?: string;
  operation?: string;
  data?: any;
  expectResult?: ExpectResult;
};

export type ScenarioConfiguration = {
  apiUrl?: string;
  apiKey?: string;
  stopOnError?: boolean;
  vars?: any;
};

export type ScenarioResult = {
};

export type ScenarioStepResult = {
  stepName: string;
  isError: boolean;
  input?: any,
  output?: any;
  status?: number;
  message?: string;
};
