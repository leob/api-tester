import * as sessions from './actions';
import { Session } from './types';
import { RootState } from '../index';

import { ActionType, getType } from 'typesafe-actions';
import { getMiddleware } from '../util';

const fetchSessions = async (action: ActionType<typeof sessions>,
                             getState: () => RootState): Promise<Session[]> => {

  const response = await fetch('/data/sessions.json');
  const sessionList: Session[] = await response.json();

  return sessionList;
};

const fetchSessionsMiddleware = getMiddleware(
  getType(sessions.updateSessions),
  sessions.fetchSessions.request, sessions.fetchSessions.success, sessions.fetchSessions.failure,
  fetchSessions
);

export const middlewares = [ fetchSessionsMiddleware ];
