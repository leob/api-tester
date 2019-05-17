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
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonText,
  IonLoading
} from '@ionic/react';

import { connect } from 'react-redux';
import { RootState, actions, selectors } from '../store';

import { Session, ScenarioStep, ScenarioStepResult } from '../store/sessions/types';

import operations from '../operations';
import { Result } from '../operations';

// This models the "unnormalized" (nested, non-flat) data that we're reading from the JSON file
type ScenarioModel = {
  name: string;
  description: string;
  definition: {},
  steps: [
    {
      name: string;
      description?: string;
      operation: string;
    }
  ]
};

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
      const scenarioData: ScenarioModel = await response.json();

      // NOTE - we're breaking all the rules here with regards to Redux! This is just a quick hack to get stuff done.
      // We're updating the session object - because this is an object reference retrieved from the store, the data in
      // the store is also updated, automatically (since it's the same object, not a copy).
      // ** TODO fix this - it goes completely against Redux's immutability principles **
      session.isLoaded = true;
      session.isError = false;
      session.error = null;
      this.setSessionData(session, scenarioData);

    } catch (ex) {
      const e: Error = ex;
      const message = "Unabled to load the scenario: " + e.message;

      session.isLoaded = false;
      session.isError = true;
      session.error = message;
      this.setSessionData(session, null);
    }

    // Update the local state ...
    this.setState(() => ({ session, sessionIndex }));
    // ... and update the Redux store
    this.props.updateSession(session);

    return;
  }

  // Copy/clone the data from the ScenarioModel into the Session (we don't copy references but data - Redux!)
  setSessionData(session: Session, data: ScenarioModel) {

    if (data === null) {
      session.scenario = null;
      session.scenarioDefinition = null;
      session.scenarioSteps = null;

      return;
    }

    // 'Unmarshal'/denormalize the JSON data into the flattened Session structure

    // copy the data
    session.scenario = {
      name: data.name,
      description: data.description
    };

    // TODO  empty for now
    session.scenarioDefinition = {};

    // copy/clone the steps
    const steps: ScenarioStep[] = data.steps.reduce(
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

    session.scenarioSteps = steps;

    // Initialize step results (empty array)
    session.scenarioStepResults = [];
  }

  close = (e: MouseEvent) => {
    e.preventDefault();

    // We 'close' the session, so we remove it and we go back to the home page (the list of scenarios)
    this.props.removeSession(this.props.match.params.sessionId);
    this.props.history.push("/");
  }

  run = async (e: MouseEvent) => {
    e.preventDefault();

    this.setState(() => ({ showLoading: true }));

    const results: ScenarioStepResult[] = await this.executeScenario(this.state.session);

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

  // TODO move this to a separate 'scenarios' module (similar to 'operations') which knows how to execute scenarios; this
  // module (plain JS, not React) could also be used as a 'standalone' node.js module, so as a CLI tool without the UI
  async executeScenario(session: Session): Promise<ScenarioStepResult[]> {
    let step: ScenarioStep;
    let results: ScenarioStepResult[] = [];

    for (step of session.scenarioSteps) {
      let result = await this.executeScenarioStep(step);

      results.push(result);
    }

    return results;
  }

  async executeScenarioStep(scenarioStep: ScenarioStep): Promise<ScenarioStepResult> {
    const name = scenarioStep.operation;
    const operation = operations[name];
    let stepResult: ScenarioStepResult;

    if (!operation) {

      stepResult = {
        stepName: scenarioStep.name,
        isError: true,
        error: "Operation not defined"
      }

    } else {
      const result: Result = await operation();

      stepResult = {
        stepName: scenarioStep.name,
        isError: result.isError
      }

      if (result.isError) {
        stepResult.error = result.error.message;
      } else {
        stepResult.data = result.data;
        stepResult.status = result.status;
      }
    }

    return stepResult;
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
            <IonList>
              <IonListHeader color="light">
                <IonLabel>Steps for {scenarioName}</IonLabel>
              </IonListHeader>
              { session.scenarioSteps.map((step, index) => (
                  <IonItem
                    key={step.name}
                  >
                    <IonLabel>
                      <h3>{step.name}</h3>
                      <p>{step.description}</p>
                      {session.scenarioStepResults[index] && (

                        <IonText color={session.scenarioStepResults[index].isError ? 'danger' : 'success'}>
                          {session.scenarioStepResults[index].isError
                            ? "Result: failure, message: " + session.scenarioStepResults[index].error
                            : "Result: success, status code: " + session.scenarioStepResults[index].status}
                        </IonText>
                  )}
                    </IonLabel>
                  </IonItem>
              ))}
            </IonList>
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

