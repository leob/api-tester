import { StateType } from 'typesafe-actions';
import { combineReducers, createStore, applyMiddleware, compose, Middleware } from 'redux';

// Scenarios module
import * as scenarioActions from './scenarios/actions';
import * as scenarioSelectors from './scenarios/selectors';
import { middlewares as scenarioMiddlewares } from './scenarios/middleware';
import scenarios from './scenarios/reducer';

// Sessions module
import * as sessionActions from './sessions/actions';
import * as sessionSelectors from './sessions/selectors';
import { middlewares as sessionMiddlewares } from './sessions/middleware';
import sessions from './sessions/reducer';

// Actions
export const actions = {
  scenarios: scenarioActions,
  sessions: sessionActions
}

// Selectors
export const selectors = {
  scenarios: scenarioSelectors,
  sessions: sessionSelectors
};

// Middlewares
const middlewares: Middleware[] = []
  .concat(scenarioMiddlewares)
  .concat(sessionMiddlewares);

// Reducers
export const rootReducer = combineReducers({
  scenarios,
  sessions
});

// Store

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
export default store;

// root state
export type RootState = StateType<typeof rootReducer>;

