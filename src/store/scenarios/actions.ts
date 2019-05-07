import { createAction, createAsyncAction } from 'typesafe-actions';
import { Scenario } from './types';

export const fetchScenarios = createAsyncAction(
  'scenarios/FETCH_REQUEST',
  'scenarios/FETCH_SUCCESS',
  'scenarios/FETCH_FAILURE'
)<void, Scenario[], Error>();

export const updateScenarios = createAction('scenarios/UPDATE_SCENARIOS', resolve =>
  () => resolve()
);
