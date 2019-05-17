export interface Scenario {
  name: string;
  description: string;
}

export interface ScenarioState {
  loading: boolean;
  error: string | null;
  scenarios: Scenario[];
}