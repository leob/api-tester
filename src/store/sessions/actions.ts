import { createAction, createAsyncAction } from 'typesafe-actions';
import { Session } from './types';

//
// NOTE:
//
// The action names (e.g. 'sessions/FETCH_REQUEST' and 'sessions/UPDATE_SESSIONS' and so on) **MUST** be coded as
// hardcoded string literals in the action definitions below - see more explanations in src/store/scenarios/actions.ts.
//

// Base async request actions, could be reused across actions
export const fetchSessions = createAsyncAction(
  'sessions/FETCH_REQUEST',
  'sessions/FETCH_SUCCESS',
  'sessions/FETCH_FAILURE'
)<void, Session[], Error>();

// This is an async action, and its actual implementation is done in src/store/sessions/middleware.ts
export const updateSessions = createAction('sessions/UPDATE_SESSIONS', action =>
  () => action()
);

export const setSearchText = createAction('sessions/SET_SEARCH_TEXT', action =>
  (searchText: string) => action(searchText)
);

export const addTrackFilter = createAction('sessions/ADD_TRACK_FILTER', action =>
  (trackName: string) => action(trackName)
);

export const removeTrackFilter = createAction('sessions/REMOVE_TRACK_FILTER', action =>
  (trackName: string) => action(trackName)
);

export const updateTrackFilters = createAction('sessions/UPDATE_TRACK_FILTERS', action =>
  (trackNames: string[]) => action(trackNames)
);

export const addFavorite = createAction('sessions/ADD_FAVORITE', action =>
  (sessionId: number) => action(sessionId)
);

export const removeFavorite = createAction('sessions/REMOVE_FAVORITE', action =>
  (sessionId: number) => action(sessionId)
);

export const updateFavoriteFilter = createAction('sessions/UPDATE_FAVORITE_FILTER', action =>
  (sessionIds: number[]) => action(sessionIds)
);
