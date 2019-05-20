export type Scenario = {
  name: string;
  configuration: ScenarioConfiguration;
  steps: ScenarioStep[];
};

export interface ScenarioStep {
  name: string;
  description?: string;
  operation?: string;
}

export interface ScenarioConfiguration {
}

export type ScenarioResult = {
}

export type ScenarioStepResult = {
  stepName: string;
  isError: boolean;
  data?: any;
  status?: number;
  message?: string;
};
