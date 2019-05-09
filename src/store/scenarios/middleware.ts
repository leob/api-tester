import * as scenarios from './actions';
import { Scenario } from './types';
// import { ScenarioState } from './types';
import { RootState } from '../index';

import { ActionType, getType } from 'typesafe-actions';
import { getMiddleware } from '../util';

const fetchScenarios = async (action: ActionType<typeof scenarios>,
                              getState: () => RootState/*ScenarioState*/): Promise<Scenario[]> => {
// TODO just for testing
//console.log(action.payload); console.log(getState().sessions.sessions); console.log(getState().scenarios.scenarios);
  const response = await fetch('/data/scenarios.json');
  const scenarioList: Scenario[] = await response.json();

  return scenarioList;
};

const fetchScenariosMiddleware = getMiddleware(
  getType(scenarios.updateScenarios),
  scenarios.fetchScenarios.request, scenarios.fetchScenarios.success, scenarios.fetchScenarios.failure,
  fetchScenarios
);

export const middlewares = [ fetchScenariosMiddleware ];
