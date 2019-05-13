import { Scenario } from '../scenarios/types';

export interface Session {
  id: string;
  scenario: Scenario;
}

export interface SessionState {
  sessions: Session[];
}
