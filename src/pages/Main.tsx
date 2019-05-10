import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import {
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonNote,
  IonItem,
  IonToast
} from '@ionic/react';

import { connect } from 'react-redux';
import { RootState, actions } from '../store';
import config from '../config';

import { Scenario, ScenarioStep } from '../store/scenarios/types';

import operations from '../operations';
import { Result } from '../operations';

const mapStateToProps = (state: RootState) => ({
  scenarios: state.scenarios.scenarios,
  selectedScenario: state.scenarios.selectedScenario
});

const mapDispatchToProps = {
  updateScenarios: (/*dummyTestValue*/) => actions.scenarios.updateScenarios(/*dummyTestValue*/),
  setSelectedScenario: (scenario: Scenario) => actions.scenarios.setSelectedScenario(scenario),
}

type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
// type Props = {} & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  showAlert: boolean;
  alertHeader?: string;
  alertMessage?: string
  // isRefreshing: boolean, showLoading: boolean, showFilterModal: boolean, loadingMessage: string
}

class Main extends Component<Props, State> {

  defaultState: State = {
    showAlert: false,
    alertHeader: '',
    alertMessage: undefined
  }

  constructor(props: Props) {
    super(props);

    props.updateScenarios(/*"a dummy test value, not used"*/);

    // this.ionRefresherRef = React.createRef<HTMLIonRefresherElement>();
    // this.ionFabRef = React.createRef<HTMLIonFabElement>();
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

// goToLink(e: MouseEvent) {
//   if (!e.currentTarget) {
//     return;
//   }
//   e.preventDefault();
//   // history.push((e.currentTarget as HTMLAnchorElement).href);
// }

  selectScenario = async (e: MouseEvent, scenario: Scenario) => {
    e.preventDefault();

    const result = await this.loadScenario(scenario.name);

    if (result.scenario) {
      this.props.setSelectedScenario(result.scenario);
    } else {
      this.props.setSelectedScenario(null);
      this.showAlert("Problem", result.message);
    }
  }

  async loadScenario(scenarioName: string): Promise<{scenario, message}> {
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

  cancel = (e: MouseEvent) => {
    e.preventDefault();

    this.props.setSelectedScenario(null);
  }

  confirm = async (e: MouseEvent) => {
    e.preventDefault();

    const scenario = this.props.selectedScenario;
    await this.executeScenario(scenario);
  }

  async executeScenario(scenario: Scenario) {
    let step: ScenarioStep;

    for (step of scenario.definition.steps) {
      const name = step.name;
      const operation = operations[name];

      if (operation) {
        const result: Result = await operation();

console.log(result);
      }
    }
  }

  render() {
    const selectedScenario = this.props.selectedScenario;

    return (

      <IonContent>

        <IonToast
          position="top"
          color="secondary"
          duration={3000}
          isOpen={this.state.showAlert}
          header={this.state.alertHeader}
          message={this.state.alertMessage}
          onDidDismiss={this.dismissAlert}
        ></IonToast>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{config.APP_TITLE}</IonCardTitle>
            <IonCardSubtitle>Testing against: {config.API_URL}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonListHeader color="light">
                <IonLabel>Scenarios</IonLabel>
              </IonListHeader>
              {this.props.scenarios.map(scenario => (
                <IonItem
                  href={`/scenarios/${scenario.name}`}
                  key={scenario.name}
                  onClick={(e: MouseEvent) => this.selectScenario(e, scenario)}
                  // onClick={this.goToLink}
                >
                  <IonLabel>
                    <h3>{scenario.name}</h3>
                  </IonLabel>
                  <IonNote slot="end">
                    <h3>{scenario.description}</h3>
                  </IonNote>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <div>
          { selectedScenario &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Selected scenario</IonCardTitle>
                <IonCardSubtitle>{selectedScenario.name}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonListHeader color="light">
                    <IonLabel>Steps</IonLabel>
                  </IonListHeader>

                  {selectedScenario.definition.steps.map(step => (
                    <IonItem
                      key={step.name}
                    >
                      {step.name}
                    </IonItem>
                  ))}
                </IonList>

                <IonButton
                    class="ion-margin-end"
                    color="secondary"
                    onClick={(e: MouseEvent) => this.confirm(e)}>
                  Select
                </IonButton>

                <IonButton
                    color="light"
                    onClick={(e: MouseEvent) => this.cancel(e)}>
                  Back</IonButton>
              </IonCardContent>

            </IonCard>
          }
        </div>
      </IonContent>
    );
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));

