export type Scenario = {
  name: string;
  configuration: ScenarioConfiguration;
  steps: ScenarioStep[];
};

export type SuccessResultField = {
  name: string, assignToVar?: string
};

export type SuccessResult = {
  status?: number;
  fields: [ SuccessResultField ];
};

export type ScenarioStep = {
  name: string;
  description?: string;
  operation?: string;
  data?: any;
  successResult?: SuccessResult;
};

export type ScenarioConfiguration = {
  apiUrl?: string;
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
