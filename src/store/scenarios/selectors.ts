import { ScenarioState, Scenario } from './types';

export function selected(state: ScenarioState): Scenario {
  return state.selectedScenario;
}
