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
  IonItem
} from '@ionic/react';

import { Scenario, ScenarioStep } from '../store/scenarios/types';

import operations from '../operations';
import { Result } from '../operations';

type Props = RouteComponentProps<{ name: string }>;

type State = {
  scenarioName: string;
  scenario: Scenario | null;
  scenarioError: string | null;
}

class ScenarioDetail extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      scenarioName: props.match.params.name,
      scenario: null,
      scenarioError: null
    }
  }

  componentDidMount() {

    this.loadScenario(this.state.scenarioName).then((result) => {
      if (result.scenario) {
        this.setState(() => ({ scenario: result.scenario }));
      } else {
        this.setState(() => ({ scenarioError: result.message }));
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

  cancel = (e: MouseEvent) => {
    e.preventDefault();
    this.props.history.goBack();
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
    const scenarioName = this.state.scenarioName;
    const scenarioError = this.state.scenarioError;

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
            <h4>Scenario {scenarioName}</h4>

            <p>
              { scenario ? scenario.description : scenarioError }
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
              onClick={(e: MouseEvent) => this.cancel(e)}>

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
                    {step.name}
                  </IonItem>
              ))}
            </IonList>
          }
        </IonContent>
      </>
    );
  }
}

export default withRouter(ScenarioDetail);

