import { createAction, createAsyncAction } from 'typesafe-actions';
import { Scenario } from './types';

function name(name: string): string {
  return 'scenarios/' + name;
}

export const fetchScenarios = createAsyncAction(
  name('FETCH_REQUEST'),
  name('FETCH_SUCCESS'),
  name('FETCH_FAILURE')
)<void, Scenario[], Error>();

export const updateScenarios = createAction(name('UPDATE_SCENARIOS'), action =>
  () => action()
);
