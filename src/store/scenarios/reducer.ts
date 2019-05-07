import * as scenarios from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ScenarioState } from './types';

const defaultState: ScenarioState = {
  selectedScenario: null,
  scenarios: []
};

export type ScenarioAction = ActionType<typeof scenarios>

export default (state = defaultState, action: ScenarioAction): ScenarioState => {
  switch (action.type) {
    case getType(scenarios.fetchScenarios.success):
      return {
        ...state,
        scenarios: action.payload
      }
    default:
      return state;
  }
};
