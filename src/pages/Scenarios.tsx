import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonToast
} from '@ionic/react';

import { connect } from 'react-redux';
import { RootState, actions } from '../store';

import { Scenario } from '../store/scenarios/types';
import { Session } from '../store/sessions/types';

// UUID package uses CommonJS
const uuidv4 = require('uuid/v4');

const mapStateToProps = (state: RootState) => ({
  scenarios: state.scenarios.scenarios,
  scenarioError: state.scenarios.error,
  sessions: state.sessions.sessions
});

const mapDispatchToProps = {
  updateScenarios: (/*dummyTestValue*/) => actions.scenarios.updateScenarios(/*dummyTestValue*/),
  addSession: (session) => actions.sessions.addSession(session)
};

type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  showAlert: boolean;
  alertHeader?: string;
  alertMessage?: string
}

const MAX_SESSIONS = 10;

class Scenarios extends Component<Props, State> {

  defaultState: State = {
    showAlert: false,
    alertHeader: '',
    alertMessage: undefined
  }

  constructor(props: Props) {
    super(props);

    props.updateScenarios(/*"a dummy test value, not used"*/);

    this.state = {
      ...this.defaultState
    };
  }

  dismissAlert = () => {
    this.setState({
      ...this.defaultState
    });
  }

  showAlert = (header: string, message: string) => {

    this.setState({
      showAlert: true,
      alertHeader: header,
      alertMessage: message
    });
  }

  selectScenario = (e: MouseEvent, scenario: Scenario) => {
    if (!e.currentTarget) {
      return;
    }
    e.preventDefault();

    if (this.props.sessions.length >= MAX_SESSIONS) {

      this.showAlert("Cannot add a session",
        `You can add up to ${MAX_SESSIONS} sessions - please close another session and try again`);

    } else {

      const sessionId = uuidv4();

      // Create an 'incomplete' session, we need this to associate the sessionId with the scenario
      const session: Session = {
        id: sessionId,
        scenarioName: scenario.name,
        isLoaded: false,
        isError: false
      }
      // add session to the store, the SessionPage will then load it from the store using the sessionId URL parameter
      this.props.addSession(session);

      this.props.history.push(`/sessions/${sessionId}`);
    }
  };

  render() {
    if (!this.props.scenarios && !this.props.scenarioError) {
      return <></>;
    }

    const buttonStyle = {textTransform: 'none'};

    const scenarioError = this.props.scenarioError;

    return (
      <>
        <IonToast
          position="top"
          color="secondary"
          duration={3000}
          isOpen={this.state.showAlert}
          header={this.state.alertHeader}
          message={this.state.alertMessage}
          onDidDismiss={this.dismissAlert}
        ></IonToast>

        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Scenarios</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonListHeader color="light">
              <IonLabel>Available test scenarios</IonLabel>
            </IonListHeader>
            {scenarioError ? (
                <IonItem>
                  <IonLabel>
                    <h3>Unable to load the scenarios</h3>
                    <p>{scenarioError}</p>
                  </IonLabel>
                </IonItem>
            ) : (
                this.props.scenarios.map(scenario => (
                  <IonItem
                    key={scenario.name}
                  >
                    <IonLabel>
                      <h3>{scenario.name}</h3>
                      <p>{scenario.description}</p>
                    </IonLabel>
                    <IonButton size="default" color="secondary" slot="end" style={buttonStyle}
                        onClick={(e) => this.selectScenario(e, scenario)}>

                      start&nbsp;
                      <IonIcon name="arrow-dropright"></IonIcon>
                    </IonButton>
                  </IonItem>
            )))}
            </IonList>
        </IonContent>
      </>
    );
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Scenarios));

