import { StateType } from 'typesafe-actions';
import { combineReducers, createStore, applyMiddleware, compose, Middleware } from 'redux';

// Actions
import * as scenariosActions from './scenarios/actions';
import * as sessionsActions from './sessions/actions';

// Selectors
import * as scenariosSelectors from './scenarios/selectors';
import * as sessionsSelectors from './sessions/selectors';

// Middlewares
import { fetchScenariosMiddleware } from './scenarios/middleware';
// import { fetchSessionsMiddleware } from './sessions/middleware';

// Reducers
import scenarios from './scenarios/reducer';
import sessions from './sessions/reducer';

// Actions
export const actions = {
  sessions: sessionsActions,
  scenarios: scenariosActions
}

// Selectors
export const selectors = {
  sessions: sessionsSelectors,
  scenarios: scenariosSelectors
};

// Middlewares
const middlewares: Middleware[] = [
  fetchScenariosMiddleware
//   fetchSessionsMiddleware,
];

// Reducers
export const rootReducer = combineReducers({
  scenarios,
  sessions
});

// Store

// root state
export type RootState = StateType<typeof rootReducer>;

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState?: {}) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}

// store; pass an optional param to rehydrate state on app start
const store = configureStore();
export default store


