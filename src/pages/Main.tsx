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

const mapStateToProps = (state: RootState) => ({
  scenarios: state.scenarios.scenarios,
  scenarioError: state.scenarios.scenarioError
  // selectedScenario: state.scenarios.selectedScenario
});

const mapDispatchToProps = {
  updateScenarios: (/*dummyTestValue*/) => actions.scenarios.updateScenarios(/*dummyTestValue*/)
  // setSelectedScenario: (scenario: Scenario) => actions.scenarios.setSelectedScenario(scenario),
}

type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
type State = {}

class Main extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    props.updateScenarios(/*"a dummy test value, not used"*/);

    this.state = {};
  }

  goToLink = (e: MouseEvent) => {
    if (!e.currentTarget) {
      return;
    }
    e.preventDefault();
    this.props.history.push((e.currentTarget as HTMLAnchorElement).href);
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
                    href={`/scenarios/${scenario.name}`}
                    key={scenario.name}
                    onClick={this.goToLink}
                  >
                    <IonLabel>
                      <h3>{scenario.name}</h3>
                      <p>{scenario.description}</p>
                    </IonLabel>
                    {/* <IonNote slot="end">
                      {scenario.description}
                    </IonNote> */}
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
)(Main));

