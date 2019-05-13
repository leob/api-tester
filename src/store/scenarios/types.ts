export type ScenarioStepResult = {
  isError: boolean;
  data?: any;
  status?: number;
  error?: string;
};

export interface ScenarioStep {
  name: string;
  description?: string;
  operation: string;
  result?: ScenarioStepResult;
}

export interface ScenarioDefinition {
  steps: ScenarioStep[];
}

export interface Scenario {
  name: string;
  description: string;
  definition?: ScenarioDefinition
}

export interface ScenarioState {
  // selectedScenario: Scenario | null;
  scenarios: Scenario[];
  scenarioError: string | null;
}