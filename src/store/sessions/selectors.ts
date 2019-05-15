import { SessionState, Session } from './types';

export function findSession(state: SessionState, sessionId: string): { session: Session; index: number } {
  const index = state.data.findIndex(session => session.id === sessionId);
  const session: Session = index >= 0 ? state.data[index] : null;

  return { session, index };
}
