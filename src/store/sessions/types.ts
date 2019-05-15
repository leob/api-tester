import { Scenario } from '../scenarios/types';

// ** TODO we have nested state here which goes against Redux's "normalization" principle - fix this "later"! **
// (see: https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)
export interface Session {
  id: string;
  scenarioName: string;
  scenario?: Scenario;
}

export interface SessionState {
  data: Session[];
}
