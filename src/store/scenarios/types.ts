// ** TODO we have nested state here which goes against Redux's "normalization" principle - fix this "later"! **
// (see: https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)

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
  loading: boolean;
  error: string | null;
  data: Scenario[];
}