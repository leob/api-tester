import { createAction, createAsyncAction } from 'typesafe-actions';
import { Scenario } from './types';

//
// NOTE:
//
// The action names (e.g. 'scenarios/FETCH_REQUEST' and 'scenarios/UPDATE_SCENARIOS' and so on) **MUST** be coded
// as hardcoded string literals in the action definitions below - you can NOT use an expression like this:
//
// const PREFIX = 'scenarios/'
// export const updateScenarios = createAction(PREFIX + 'UPDATE_SCENARIOS', ...)
//
// If you do this (i.e. you make the action name an expression instead of a string literal), then within
// the reducer the Typescript type 'type ScenarioAction' based on "import * as scenarios from './actions'"
// will lead to an incorrect 'ScenarioAction' type being constructed.
//
// This  will then in turn lead to the "action.payload" expression within the reducer not being recognized as valid
// (Typescript then thinks that the 'ScenarioAction' type that it constructed does not have an 'action' member).
//
// Strange but true, and this is likely due to the peculiarities of how the ES6 "export" and "import" statements work.
//

// Base async request actions, could be reused across actions
export const fetchScenarios = createAsyncAction(
  'scenarios/FETCH_REQUEST',
  'scenarios/FETCH_SUCCESS',
  'scenarios/FETCH_FAILURE'
)<void, Scenario[], Error>();

// This is an async action, and its actual implementation is done in src/store/scenarios/middleware.ts
export const updateScenarios = createAction('scenarios/UPDATE_SCENARIOS', action =>
  (/*dummyTestValue: string*/) => action(/*dummyTestValue*/)
);

export const setSelectedScenario = createAction('scenarios/SET_SELECTED_SCENARIO', action =>
  (scenario: Scenario) => action(scenario)
);
