import { createAction } from 'typesafe-actions';
import { Session } from './types';

//
// NOTE:
//
// The action names (e.g. 'sessions/FETCH_REQUEST' and 'sessions/UPDATE_SESSIONS' and so on) **MUST** be coded as
// hardcoded string literals in the action definitions below - see more explanations in src/store/scenarios/actions.ts.
//

export const addSession = createAction('sessions/ADD_SESSION', action =>
  (session: Session) => action(session)
);

export const removeSession = createAction('sessions/REMOVE_SESSION', action =>
  (sessionId: string) => action(sessionId)
);

// export const updateSession = createAction('sessions/UPDATE_SESSION', action =>
//   (session: Session) => action(session)
// );
