import { createAction, createAsyncAction } from 'typesafe-actions';
import { Session } from './types';

function name(name: string): string {
  return 'sessions/' + name;
}

export const fetchSessions = createAsyncAction(
  name('FETCH_REQUEST'),
  name('FETCH_SUCCESS'),
  name('FETCH_FAILURE')
)<void, Session[], Error>();

export const updateSessions = createAction(name('UPDATE_SESSIONS'), action =>
  () => action()
);

export const setSearchText = createAction(name('SET_SEARCH_TEXT'), action =>
  (searchText: string) => action(searchText)
);

export const addTrackFilter = createAction(name('ADD_TRACK_FILTER'), action =>
  (trackName: string) => action(trackName)
);

export const removeTrackFilter = createAction(name('REMOVE_TRACK_FILTER'), action =>
  (trackName: string) => action(trackName)
);

export const updateTrackFilters = createAction(name('UPDATE_TRACK_FILTERS'), action =>
  (trackNames: string[]) => action(trackNames)
);

export const addFavorite = createAction(name('ADD_FAVORITE'), action =>
  (sessionId: number) => action(sessionId)
);

export const removeFavorite = createAction(name('REMOVE_FAVORITE'), action =>
  (sessionId: number) => action(sessionId)
);

export const updateFavoriteFilter = createAction(name('UPDATE_FAVORITE_FILTER'), action =>
  (sessionIds: number[]) => action(sessionIds)
);
