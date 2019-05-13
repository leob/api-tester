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
  IonText
} from '@ionic/react';

import { connect } from 'react-redux';
import { RootState, actions } from '../store';

import { Session } from '../store/sessions/types';
import { Scenario, ScenarioStep } from '../store/scenarios/types';

import operations from '../operations';
import { Result } from '../operations';

const mapStateToProps = (state: RootState) => ({
  sessions: state.sessions.sessions
});

const mapDispatchToProps = {
  removeSession: (session) => actions.sessions.removeSession(session)
};

// sessionId is set via a URL parameter, passed as a property via React Router
type BaseProps = { sessionId: string };
type Props = RouteComponentProps<BaseProps> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  session: Session | null;
  scenario: Scenario | null;
  scenarioError: string | null;
}

class SessionPage extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      session: null,
      scenario: null,
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

  loadData() {
    const sessionId = this.props.match.params.sessionId;
    const session = this.props.sessions.find(session => session.id === sessionId);

    this.setState(() => ({ session }));

    this.loadScenario(session.scenario.name).then((result) => {
      if (result.scenario) {
        this.setState(() => ({ scenario: result.scenario, scenarioError: null }));
      } else {
        this.setState(() => ({ scenarioError: result.message, scenario: null }));
      }
    });
  }

  async loadScenario(scenarioName: string): Promise<{scenario: Scenario, message: string}> {
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

  close = (e: MouseEvent) => {
    e.preventDefault();

    // We 'close' the session, so we remove it and we go back to the home page (the list of scenarios)
    this.props.removeSession(this.state.session);
    this.props.history.push("/");
  }

  run = async (e: MouseEvent) => {
    e.preventDefault();

    const scenario = this.state.scenario;
    await this.executeScenario(scenario);
  }

// TODO move this to a separate 'scenarios' module (similar to 'operations') which knows how to execute scenarios; this
// module (plain JS, not React) could also be used as a 'standalone' node.js module, so as a CLI tool without the UI
  async executeScenario(scenario: Scenario) {
    let step: ScenarioStep;

    for (step of scenario.definition.steps) {
      const name = step.name;
      const operation = operations[name];

      if (operation) {
        const result: Result = await operation();
// TODO process step results
//console.log(result);
      } else {
// TODO add feedback that the operation does not exist/was not implemented
      }
    }
  }

  render() {
    if (!this.state.scenario && !this.state.scenarioError) {
      return <></>;
    }

    const scenario = this.state.scenario;
    const scenarioError = this.state.scenarioError;
    // Get scenarioName from this.state.session.scenario - this will be defined even
    // when this.state.scenario is null (because it failed to load)
    const scenarioName = this.state.session.scenario.name;

    return (
      <>
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
            <h4>Scenario: {scenarioName}</h4>

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

