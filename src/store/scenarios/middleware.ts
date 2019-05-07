import * as scenarios from './actions';
import { Scenario, ScenarioState } from './types';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware } from 'redux';

export const fetchScenariosMiddleware: Middleware<{}, ScenarioState> =
    ({ getState }) => next => async (action: ActionType<typeof scenarios>) => {

  next(action);

  if (action.type !== getType(scenarios.updateScenarios)) {
    return;
  }

  next(scenarios.fetchScenarios.request());
  try {
    const response = await fetch('/data/scenarios.json');
    const sessionList: Scenario[] = await response.json();
    next(scenarios.fetchScenarios.success(sessionList));
  } catch (e) {
    next(scenarios.fetchScenarios.failure(e));
  }
};
