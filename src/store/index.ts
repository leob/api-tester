import { StateType } from 'typesafe-actions';
import { Middleware } from 'redux';

import rootReducer from './root-reducer';

import { fetchScenariosMiddleware } from './scenarios/middleware';
// import { fetchSessionsMiddleware } from './sessions/middleware';

import * as scenariosSelectors from './scenarios/selectors';
import * as sessionsSelectors from './sessions/selectors';

import * as scenariosActions from './scenarios/actions';
import * as sessionsActions from './sessions/actions';

export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const selectors = {
  sessions: sessionsSelectors,
  scenarios: scenariosSelectors
};

export const actions = {
  sessions: sessionsActions,
  scenarios: scenariosActions
}

export const middlewares: Middleware[] = [
  fetchScenariosMiddleware
//   fetchSessionsMiddleware
]

export type RootState = StateType<typeof rootReducer>;
