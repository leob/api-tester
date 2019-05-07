export interface Scenario {
  name: string;
  description: number;
}

export interface ScenarioState {
  selectedScenario?: Scenario
  scenarios: Scenario[]
}