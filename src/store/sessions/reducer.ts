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
      sessions: state.sessions.filter(session => session.id !== action.payload)
    };
  // //
  // // NOTE:
  // //
  // // "updateSession" may actually not be needed: if we retrieve a reference to the session from the
  // // store, then we can use that reference to DIRECTLY update the properties of the session, in the store -
  // // we're working with a reference to the object, not a copy of it (although this probably goes against the
  // // "immutability" principle of Redux!)
  // //
  // case getType(sessions.updateSession):
  //   const index = state.sessions.findIndex(session => session.id === action.payload.id);

  //   // Recompose "sessions" by inserting the updated session at the right position (index)
  //   const updatedSessions = [
  //     ...state.sessions.slice(0, index),
  //     action.payload,
  //     ...state.sessions.slice(index + 1)
  //   ];

  //   return {
  //     ...state,
  //     sessions: updatedSessions
  //   };
  default:
    return state;
  }
}



