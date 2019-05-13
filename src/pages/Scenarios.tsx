import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  // IonNote,
  IonItem
} from '@ionic/react';

import { connect } from 'react-redux';
import { RootState, actions } from '../store';

import { Scenario } from '../store/scenarios/types';
import { Session } from '../store/sessions/types';

// UUID package uses CommonJS
const uuidv4 = require('uuid/v4');

const mapStateToProps = (state: RootState) => ({
  scenarios: state.scenarios.scenarios,
  scenarioError: state.scenarios.scenarioError
});

const mapDispatchToProps = {
  updateScenarios: (/*dummyTestValue*/) => actions.scenarios.updateScenarios(/*dummyTestValue*/),
  addSession: (session) => actions.sessions.addSession(session)
};

type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
type State = {}

class Scenarios extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    props.updateScenarios(/*"a dummy test value, not used"*/);

    this.state = {};
  }

  selectScenario = (e: MouseEvent, scenario: Scenario) => {
    if (!e.currentTarget) {
      return;
    }
    e.preventDefault();

    const sessionId = uuidv4();

    const session: Session = {
      id: sessionId,
      scenario: scenario
    }

    this.props.addSession(session);

    this.props.history.push(`/sessions/${sessionId}`);
  };

  render() {
    if (!this.props.scenarios && !this.props.scenarioError) {
      return <></>;
    }

    const scenarioError = this.props.scenarioError;

    return (
      <>
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
                    href="#"
                    key={scenario.name}
                    onClick={(e) => this.selectScenario(e, scenario)}
                  >
                    <IonLabel>
                      <h3>{scenario.name}</h3>
                      <p>{scenario.description}</p>
                    </IonLabel>
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

