import { SessionState, Session } from './types';

// the following selector doesn't really do anything, just for demo purposes :-)
export function findSession(state: SessionState, sessionId: string): { session: Session; index: number } {
  const index = state.sessions.findIndex(session => session.id === sessionId);
  const session: Session = index >= 0 ? state.sessions[index] : null;

  return { session: state.sessions[index], index };
}
