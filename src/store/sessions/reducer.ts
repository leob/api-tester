import * as sessions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { SessionState } from './types';

const defaultState: SessionState = {
  sessions: []
}

export type SessionAction = ActionType<typeof sessions>;

export default (state = defaultState, action: SessionAction): SessionState => {
  switch (action.type) {
  case getType(sessions.addSession):
    return {
      ...state,
      sessions: [ ...state.sessions, action.payload ]
    };
  case getType(sessions.removeSession):
    return {
      ...state,
      sessions: state.sessions.filter(session => session.id !== action.payload.id)
    };
  default:
    return state;
  }
}



