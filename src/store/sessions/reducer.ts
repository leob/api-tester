import * as sessions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { SessionState } from './types';

const defaultState: SessionState = {
  data: []
}

export type SessionAction = ActionType<typeof sessions>;

export default (state = defaultState, action: SessionAction): SessionState => {
  switch (action.type) {
  case getType(sessions.addSession):
    return {
      ...state,
      data: [ ...state.data, action.payload ]
    };
  case getType(sessions.removeSession):
    return {
      ...state,
      data: state.data.filter(session => session.id !== action.payload)
    };
  //
  // NOTE:
  //
  // "updateSession" is not needed **at this moment**: right now, we're retrieving an object reference to the session
  // from the store, and we use that object reference to DIRECTLY update the properties of the session, IN THE STORE -
  // this works because we're working with a reference to the object, not a copy of it.
  //
  // However:
  //
  // ** TODO fix this - it goes completely against Redux's immutability principles! **
  // See: https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
  //
  // case getType(sessions.updateSession):
  //   const index = state.data.findIndex(session => session.id === action.payload.id);

  //   // Recompose "sessions" by inserting the updated session at the right position (index)
  //   const updatedSessions = [
  //     ...state.data.slice(0, index),
  //     action.payload,
  //     ...state.data.slice(index + 1)
  //   ];

  //   return {
  //     ...state,
  //     data: updatedSessions
  //   };
  default:
    return state;
  }
}



