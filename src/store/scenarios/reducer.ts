import * as scenarios from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ScenarioState } from './types';

const defaultState: ScenarioState = {
  // selectedScenario: null,
  scenarios: [],
  scenarioError: null
};

export type ScenarioAction = ActionType<typeof scenarios>;

export default (state = defaultState, action: ScenarioAction): ScenarioState => {
  switch (action.type) {
    case getType(scenarios.fetchScenarios.success):
      return {
        ...state,
        scenarios: action.payload,
        scenarioError: null
      }
      case getType(scenarios.fetchScenarios.failure):
      return {
        ...state,
        scenarioError: action.payload.message,
        scenarios: []
      }
    // case getType(scenarios.setSelectedScenario):
    //   return {
    //     ...state,
    //     selectedScenario: action.payload
    //   }
    default:
      return state;
  }
};
