import * as scenarios from './actions';
import { Scenario } from './types';
// import { ScenarioState } from './types';
import { RootState } from '../index';

import { ActionType, getType } from 'typesafe-actions';
import { getAsyncHandler } from '../util';

// Implementation for the 'scenarios/UPDATE_SCENARIOS' handler
const fetchScenarios = async (action: ActionType<typeof scenarios>,
                              getState: () => RootState/*ScenarioState*/): Promise<Scenario[]> => {
// TODO just for testing
// console.log(action); console.log(getState().sessions.sessions); console.log(getState().scenarios.scenarios);
  const response = await fetch('/data/scenarios.json');
  const scenarioList: Scenario[] = await response.json();

  return scenarioList;
};

// Return the "Redux-Thunk" style async handlers for the async actions that we've defined in actions.ts
export const handlers = [

  // Implementation for 'scenarios/UPDATE_SCENARIOS'
  getAsyncHandler(
    getType(scenarios.updateScenarios),
    scenarios.fetchScenarios.request,
    scenarios.fetchScenarios.success,
    scenarios.fetchScenarios.failure,
    fetchScenarios
  )
];

