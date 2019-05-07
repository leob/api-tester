import { combineReducers } from 'redux';

import scenarios from './scenarios/reducer';
import sessions from './sessions/reducer';

const rootReducer = combineReducers({
  scenarios,
  sessions
});


export default rootReducer;
