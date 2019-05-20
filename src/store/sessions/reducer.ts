import * as sessions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { SessionState, Session } from './types';

const defaultState: SessionState = {
  sessions: []
}

export type SessionAction = ActionType<typeof sessions>;

function updatedSessions(state: SessionState, sessionId: string, session: Session): Session[] {
  const index = state.sessions.findIndex(session => session.id === sessionId);

  // Recompose "sessions" by inserting the updated session at the right position (index),
  // meaning that we're completely replacing the session (remove and insert)
  return [
    ...state.sessions.slice(0, index),
    session,
    ...state.sessions.slice(index + 1)
  ];
}

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
  case getType(sessions.updateSession):
    return {
      ...state,
      sessions: updatedSessions(state, action.payload.id, action.payload)
    };
  case getType(sessions.addSessionStepResult):
    // Make a "shallow" copy
    let session: Session = { ...action.payload.session };

    // Replace step results (immutably)
    session.scenarioStepResults = [ ...session.scenarioStepResults, action.payload.stepResult ];

    return {
      ...state,
      sessions: updatedSessions(state, action.payload.session.id, session)
    };
  case getType(sessions.resetSessions):
    return {
      ...state,
      sessions: state.sessions.map(session => {session.wasExecuted = false; return session;})
    };
  default:
    return state;
  }
}



