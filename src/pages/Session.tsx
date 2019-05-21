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
  scenario: Scenario | null;
  showLoading: boolean;
  forceReload: boolean;
};

class SessionPage extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      showLoading: false,
      forceReload: false,
      session: null,
      sessionIndex: null,
      scenario: null
    }
  }

  componentDidMount() {
    this.loadData(false);
  }

  componentDidUpdate(prevProps, prevState) {

    // If the page is called with a different SessionID parameter, then we must (re)load the session data
    if ( this.props.match.params.sessionId !== prevProps.match.params.sessionId || this.state.forceReload ) {
      const forceReload = this.state.forceReload;

      if (forceReload) {
        this.setState(() => ({ forceReload: false }));
      }

      this.loadData(forceReload);
    }
  }

  async loadData(forceReload: boolean) {
    const sessionId = this.props.match.params.sessionId;

    await this.loadSession(sessionId, forceReload);
  }

  async loadSession(sessionId: string, forceReload: boolean) {
    const { session, index: sessionIndex } = this.props.findSession(sessionId);

    // If the session was not found then set error state (this should normally never happen)
    if (!session) {
      this.setState(() => ({ session: null, sessionIndex: null, scenario: null }));
      return;
    }

    // We *ALWAYS* load the full scenario object (so that we can run it) - and we store this full (complete)
    // scenario object in the local state; however. in the Redux store we store only a partial version
    const {scenario, message} = await this.loadScenario(session.scenarioName);

    // If the session was already executed then don't touch it, we need to display the results
    if (session.wasExecuted && !forceReload) {
      this.setState(() => ({ session, sessionIndex, scenario }));
      return;
    }

    // Session not yet loaded/populated, store scenario data etc in the session
    this.populateSession(session, message, scenario);

    // Update the local state ...
    this.setState(() => ({ session, sessionIndex, scenario }));
    // ... and update the Redux store
    this.props.updateSession(session);

    return;
  }

  async loadScenario(scenarioName: string): Promise<{ scenario: Scenario, message: string }> {
    let scenario: Scenario = null;
    let message: string = null;

    try {
      const response = await fetch('/data/scenarios/' + scenarioName + '.json');
      scenario = await response.json();

    } catch (ex) {
      const e: Error = ex;
      message = "Unabled to load the scenario: " + e.message;
    }

    return { scenario, message };
  }

  // 'Populate' the (initially incomplete) Session object so it becomes a complete, "valid" Session
  populateSession(session: Session, error: string, scenario: Scenario) {

    session.wasExecuted = false;
    session.isError = error !== null;
    session.error = error;

    // Copy/clone the *relevant* data from the Scenario into the Session (we don't copy references,
    // but data - Redux!) - we "unmarshal"/denormalize the JSON data into the flattened Session structure
    this.copySomeScenarioDataIntoSession(session, scenario);
  }

  copySomeScenarioDataIntoSession(session: Session, scenario: Scenario) {

    session.scenario = null;
    session.scenarioSteps = null;

    // no scenario data, nothing to do
    if (scenario === null) {
      return;
    }

    // Copy the data (partial - only the properties we need/want in the Redux store)
    session.scenario = {
      name: scenario.name
    };

    // Copy/clone the steps (partial - only the properties we need/want in the Redux store)
    session.scenarioSteps = scenario.steps.reduce(
      (steps, step) => {
        // copy the data
        steps.push({
          name: step.name,
          description: step.description || step.name
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

  reload = (e: MouseEvent) => {
    e.preventDefault();

    this.setState(() => ({ forceReload: true }));
  }

  run = async (e: MouseEvent) => {
    e.preventDefault();

    this.setState(() => ({ showLoading: true }));

    const results: ScenarioStepResult[] = await executeScenario(this.state.scenario);

    let session = this.state.session;

    // Set wasExecuted to true and update the Redux store
    session.wasExecuted = true;
    this.props.updateSession(session);

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
      this.setState(() => ({ session: updatedSession, sessionIndex, showLoading: false }));
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
            { scenarioError && (<p><IonText color="error">{scenarioError}</IonText></p>) }

            { scenario &&
                <IonButton
                  class="ion-margin-end"
                  color="primary"
                  style={{textTransform: 'none'}}
                  onClick={(e: MouseEvent) => this.run(e)}>

                  run
                </IonButton>
            }

            <IonButton
              class="ion-margin-end"
              color="light"
              style={{textTransform: 'none'}}
              onClick={(e: MouseEvent) => this.close(e)}>

              close
            </IonButton>

            <IonButton
              class="ion-margin-start"
              color="light"
              style={{textTransform: 'none'}}
              onClick={(e: MouseEvent) => this.reload(e)}>

              reload scenario
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

