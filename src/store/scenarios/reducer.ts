import * as scenarios from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ScenarioState } from './types';

const defaultState: ScenarioState = {
  loading: false,
  error: null,
  scenarios: []
};

export type ScenarioAction = ActionType<typeof scenarios>;

export default (state = defaultState, action: ScenarioAction): ScenarioState => {
  switch (action.type) {
    case getType(scenarios.fetchScenarios.request):
      return {
        ...state,
        loading: true,
        error: null
      }
    case getType(scenarios.fetchScenarios.success):
      return {
        ...state,
        loading: false,
        error: null,
        scenarios: action.payload,
      }
    case getType(scenarios.fetchScenarios.failure):
      return {
        ...state,
        error: action.payload.message,
      }
    default:
      return state;
  }
};
