import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonTitle,
  IonContent,
  IonText,
  IonLoading
} from '@ionic/react';

import { connect } from 'react-redux';
import { RootState, actions, selectors } from '../store';

import { Session } from '../store/sessions/types';
import { Scenario, ScenarioStep, ScenarioStepResult } from '../lib/types';
import { executeScenario } from '../lib/scenario-runner';

import ScenarioResults from '../components/ScenarioResults';

const mapStateToProps = (state: RootState) => ({
  findSession: (sessionId) => selectors.sessions.findSession(state.sessions, sessionId)
});

const mapDispatchToProps = {
  updateSession: (session) => actions.sessions.updateSession(session),
  removeSession: (sessionId) => actions.sessions.removeSession(sessionId),
  addSessionStepResult: (session, stepResult) => actions.sessions.addSessionStepResult(session, stepResult)
};

// sessionId is set via a URL parameter, passed as a property via React Router
type BaseProps = { sessionId: string };
type Props = RouteComponentProps<BaseProps> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  session: Session | null;
  sessionIndex: number | null;
  showLoading: boolean;
};

class SessionPage extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      showLoading: false,
      session: null,
      sessionIndex: null
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {

    // If the page is called with a different SessionID parameter, then we must (re)load the session data
    if (this.props.match.params.sessionId !== prevProps.match.params.sessionId) {
      this.loadData();
    }
  }

  async loadData() {
    const sessionId = this.props.match.params.sessionId;

    await this.loadSession(sessionId);
  }

  async loadSession(sessionId: string) {
    const { session, index: sessionIndex } = this.props.findSession(sessionId);

    // If the session was not found then set error state (this should normally never happen)
    if (!session) {
      this.setState(() => ({ session: null, sessionIndex: null }));
      return;
    }

    // If session was already loaded then we're done
    if (session.isLoaded) {
      this.setState(() => ({ session, sessionIndex }));
      return;
    }

    // Else: scenario not loaded yet (but we know its name)
    const scenarioName = session.scenarioName;

    try {
      const response = await fetch('/data/scenarios/' + scenarioName + '.json');
      const scenarioData: Scenario = await response.json();

      this.populateSession(session, true, false, null, scenarioData);

    } catch (ex) {
      const e: Error = ex;
      const message = "Unabled to load the scenario: " + e.message;

      this.populateSession(session, false, true, message, null);
    }

    // Update the local state ...
    this.setState(() => ({ session, sessionIndex }));
    // ... and update the Redux store
    this.props.updateSession(session);

    return;
  }

  // 'Populate' the (initially incomplete) Session object so it becomes a complete, "valid" Session
  populateSession(session: Session, isLoaded: boolean, isError: boolean, error: string, data: Scenario) {

    session.isLoaded = isLoaded;
    session.isError = isError;
    session.error = error;

    session.scenario = null;
    session.scenarioDefinition = null;
    session.scenarioSteps = null;

    // no data, nothing more to do
    if (data === null) {
      return;
    }

    // Copy/clone the data from the ScenarioModel into the Session (we don't copy references,
    // but data - Redux!) - 'unmarshal'/denormalize the JSON data into the flattened Session structure

    // Copy the data
    session.scenario = {
      name: data.name,
      description: data.description
    };

    // Copy the definition - TODO  empty for now
    session.scenarioDefinition = {};

    // Copy/clone the steps
    session.scenarioSteps = data.steps.reduce(
      (steps, step) => {
        // copy the data
        steps.push({
          name: step.name,
          description: step.description,
          operation: step.operation
        });

        return steps;
      }, [] as ScenarioStep[]
    );

    // Initialize step results (empty array)
    session.scenarioStepResults = [];
  }

  close = (e: MouseEvent) => {
    e.preventDefault();

    // We 'close' the session, so we remove it and we go back to the home page (the list of scenarios)
    this.props.removeSession(this.props.match.params.sessionId);
    this.props.history.goBack();
  }

  run = async (e: MouseEvent) => {
    e.preventDefault();

    this.setState(() => ({ showLoading: true }));

    const results: ScenarioStepResult[] = await executeScenario(this.state.session.scenarioSteps);

    let session = this.state.session;

    // Store the results in the Redux store
    for (let result of results) {
      this.props.addSessionStepResult(session, result);
    }

    // Session updated in the Redux store - retrieve it back and update the "local" session,
    // so that the UI will get updated with session results
    const { session: updatedSession, index: sessionIndex } = this.props.findSession(session.id);

    // Wait a few seconds before closing the loader/spinner, in case "executeScenario" takes only a fraction of a second;
    // we diable the loading indicator, and we udpate the session
    setTimeout(() => {
      this.setState(() => ({ showLoading: false, session: updatedSession, sessionIndex }));
    }, 1500);
  }

  render() {
    if (!this.state.session) {
      return <></>;
    }

    const session = this.state.session;

    const scenario = session ? this.state.session.scenario : null;
    const scenarioName = session.scenarioName || "Unknown";
    const sessionIndex = this.state.sessionIndex;
    const scenarioError = session.error;

    return (
      <>
        <IonLoading
          isOpen={this.state.showLoading}
          onDidDismiss={() => this.setState(() => ({ showLoading: false }))}
          message='Please wait...'
          translucent={false}
        >
        </IonLoading>

        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{scenarioName}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div className="ion-padding about-info">
            <h4>{(sessionIndex != null ? "Session " + (sessionIndex+1) + ": " : "") + scenarioName}</h4>

            <p>
              { scenario ? scenario.description : (<IonText color="error">{scenarioError}</IonText>) }
            </p>

            { scenario &&
                <IonButton
                  class="ion-margin-end"
                  color="secondary"
                  onClick={(e: MouseEvent) => this.run(e)}>

                  Run
                </IonButton>
            }

            <IonButton
              color="light"
              onClick={(e: MouseEvent) => this.close(e)}>

              Close
            </IonButton>
          </div>

          { scenario &&
              <ScenarioResults
                scenarioName={scenarioName}
                scenarioSteps={session.scenarioSteps}
                scenarioStepResults={session.scenarioStepResults}
              />
            }
        </IonContent>
      </>
    );
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionPage));

