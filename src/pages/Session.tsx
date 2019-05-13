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

import { Session } from '../store/sessions/types';
import { Scenario, ScenarioStep, ScenarioStepResult } from '../store/scenarios/types';

import operations from '../operations';
import { Result } from '../operations';

const mapStateToProps = (state: RootState) => ({
  sessions: state.sessions.sessions,
  findSession: (sessionId) => selectors.sessions.findSession(state.sessions, sessionId)
});

const mapDispatchToProps = {
  // updateSession: (session) => actions.sessions.updateSession(session),
  removeSession: (sessionId) => actions.sessions.removeSession(sessionId)
};

// sessionId is set via a URL parameter, passed as a property via React Router
type BaseProps = { sessionId: string };
type Props = RouteComponentProps<BaseProps> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  showLoading: boolean;
  session: Session | null;
  sessionIndex: number | null;
  scenarioName: string | null;
  scenarioError: string | null;
}

class SessionPage extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      showLoading: false,
      session: null,
      sessionIndex: null,
      scenarioName: null,
      scenarioError: null
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
    const { session, index } = this.props.findSession(sessionId);

    // If the session was not found then set error state
    if (!session) {
      this.setState(() => ({ session: null, sessionIndex: null, scenarioName: null, scenarioError: "Session not found" }));
      return;
    }

    // If the scenario was already loaded (into the session)
    if (session.scenario) {
      this.setState(() => ({ session, sessionIndex: index, scenarioName: session.scenarioName, scenarioError: null }));
      return;
    }

    // Else: scenario not loaded yet (but we know its name)
    const scenarioName = session.scenarioName;

    try {
      const response = await fetch('/data/scenarios/' + scenarioName + '.json');
      const scenario: Scenario = await response.json();

      // Update the session object - because this is a reference retrieved from the store,
      // the data in the store is also up to date, automatically (since it's the same object, not a copy)
      session.scenario = scenario;
      // this.props.updateSession(session);   // So this isn't needed ...

      this.setState(() => ({ session, sessionIndex: index, scenarioName, scenarioError: null }));

    } catch (ex) {
      const e: Error = ex;
      const message = "Unabled to load the scenario: " + e.message;

      this.setState(() => ({ session: null, sessionIndex: index, scenarioName, scenarioError: message }));
    }

    return;
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

    const scenario = this.state.session.scenario;
    await this.executeScenario(scenario);

    // Wait a few seconds before closing the loader/spinner, in case "executeScenario" takes only a fraction of a second
    setTimeout(() => {
      this.setState(() => ({ showLoading: false }));
    }, 2000);
  }

  // TODO move this to a separate 'scenarios' module (similar to 'operations') which knows how to execute scenarios; this
  // module (plain JS, not React) could also be used as a 'standalone' node.js module, so as a CLI tool without the UI
  async executeScenario(scenario: Scenario) {
    let step: ScenarioStep;

    for (step of scenario.definition.steps) {
      let result = await this.executeScenarioStep(step);
      step.result = result;
    }
  }

  async executeScenarioStep(scenarioStep: ScenarioStep): Promise<ScenarioStepResult> {
    const name = scenarioStep.operation;
    const operation = operations[name];
    let stepResult: ScenarioStepResult;

    if (!operation) {

      stepResult = {
        isError: true,
        error: "Operation not defined"
      }

    } else {
      const result: Result = await operation();

      stepResult = {
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
    if (!this.state.session && !this.state.scenarioError) {
      return <></>;
    }

    const scenario = this.state.session ? this.state.session.scenario : null;
    const scenarioName = this.state.scenarioName || "Unknown";
    const sessionIndex = this.state.sessionIndex;
    const scenarioError = this.state.scenarioError;

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
              { scenario.definition.steps.map(step => (
                  <IonItem
                    key={step.name}
                  >
                    <IonLabel>
                      <h3>{step.name}</h3>
                      <p>{step.description}</p>
                      {step.result && (

                        <IonText color={step.result.isError ? 'danger' : 'success'}>
                          {step.result.isError
                            ? "Result: failure, message: " + step.result.error
                            : "Result: success, status code: " + step.result.status}
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

