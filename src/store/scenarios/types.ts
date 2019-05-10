export interface ScenarioStep {
  name: string;
  description?: string;
  operation: string;
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
  selectedScenario?: Scenario;
  scenarios: Scenario[];
}