export type Scenario = {
  name: string;
  description: string;
  definition: ScenarioDefinition;
  steps: ScenarioStep[];
};

export interface ScenarioStep {
  name: string;
  description?: string;
  operation: string;
}

export interface ScenarioDefinition {
}

export type ScenarioResult = {
}

export type ScenarioStepResult = {
  stepName: string;
  isError: boolean;
  data?: any;
  status?: number;
  error?: string;
};
