import { Scenario } from '../scenarios/types';
import { ScenarioDefinition, ScenarioStep, ScenarioResult, ScenarioStepResult } from '../../lib/types';

//
// NOTE:
//
// Session uses a "flat" structure: ScenarioSteps aren't nested within Scenario but sit directly under Session;
// same for ScenarioResult and ScenarioStepResult - they're not a property of Scenario and ScenarioStep but
// a direct child of Session.
//
// This 'flat' (partially normalized) structure makes it easier to implement Redux's "immutability".
//
// (note that normalization is only partial, not complete - each session loads its own "copy" of ScenarioDefinition
// and so on, which means there can be multiple copies of the same scenario within the Redux store - this is not a
// problem, because these objects are never mutated, see comment above about READONLY and READ/WRITE; so, to make
// a long story short, the data are normalized WITHIN one session, but not across all sessions)
//
export interface Session {    // "Flat" structure which contains scenario, scenarioSteps etc as direct descendants
  id: string;
  scenarioName: string;
  scenario?: Scenario;
  scenarioDefinition?: ScenarioDefinition;
  scenarioResult?: ScenarioResult[];
  scenarioSteps?: ScenarioStep[];
  scenarioStepResults?: ScenarioStepResult[];
  isLoaded: boolean;
  isError: boolean;
  error?: string;
}

export interface SessionState {
  sessions: Session[];
}
