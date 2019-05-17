import { StateType } from 'typesafe-actions';
import { combineReducers, createStore, applyMiddleware, compose, Middleware } from 'redux';
import { getAsyncMiddleware, DispatchHandlerMapping } from './util';

// Scenarios module
import * as scenarioActions from './scenarios/actions';
import { handlers as scenarioHandlers } from './scenarios/handlers';
import scenarios from './scenarios/reducer';

// Sessions module
import * as sessionActions from './sessions/actions';
import * as sessionSelectors from './sessions/selectors';
import { handlers as sessionHandlers } from './sessions/handlers';
import sessions from './sessions/reducer';

// Actions
export const actions = {
  scenarios: scenarioActions,
  sessions: sessionActions
}

// Selectors
export const selectors = {
  // scenarios: scenarioSelectors,
  sessions: sessionSelectors
};

// "Thunk style" async handlers
const handlers = [
  ...scenarioHandlers,
  ...sessionHandlers
] as DispatchHandlerMapping<any, any>[];

// Reducers
const rootReducer = combineReducers({
  scenarios,
  sessions
});

// Store

// convert the list of async handlers to a map
const handlerMap = handlers.reduce(
  (map, handler) => {
    map.set(handler.actionType, handler.handler);
    return map;
  }, new Map()
);
// Create a middleware that processes the async handlers
const asyncMiddleware: Middleware = getAsyncMiddleware(handlerMap);

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState?: {}) {

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(asyncMiddleware))
  );

  return store;
}

// store; pass an optional param to rehydrate state on app start
const store = configureStore();
export default store;

// root state
export type RootState = StateType<typeof rootReducer>;

