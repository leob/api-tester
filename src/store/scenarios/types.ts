export interface ScenarioStep {
    name: string;
    description?: string;
    operation: string;
  }

export interface Scenario {
  name: string;
  description: string;
  steps: ScenarioStep[];
}

export interface ScenarioState {
  selectedScenario?: Scenario
  scenarios: Scenario[]
}