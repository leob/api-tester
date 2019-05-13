import { SessionState, Session } from './types';

// the following selector doesn't really do anything, just for demo purposes :-)
export function allSessions(state: SessionState): Session[] {
  return state.sessions;
}
