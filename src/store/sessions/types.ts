import { Scenario } from '../scenarios/types';

// ** TODO we have nested state here which goes against Redux's "normalization" principle - fix this "later"! **
// (see: https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)

// READONLY copy of the scenario step definition loaded from the scenario's JSON file
export interface ScenarioStep {
  name: string;
  description?: string;
  operation: string;
}

// READONLY copy of the scenario definition loaded from the scenario's JSON file
export interface ScenarioDefinition {
}

// READ/WRITE - this object will be mutated within the session
export type ScenarioResult = {
}

// READ/WRITE - this object will be mutated within the session
export type ScenarioStepResult = {
  stepName: string;
  isError: boolean;
  data?: any;
  status?: number;
  error?: string;
};

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
