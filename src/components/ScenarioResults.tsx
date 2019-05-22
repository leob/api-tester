import React, { Component } from 'react';

import {
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle
} from '@ionic/react';

import { ScenarioStep, ScenarioStepResult } from '../lib/types';

type Props = {
  scenarioName: string;
  scenarioSteps: ScenarioStep[];
  scenarioStepResults: ScenarioStepResult[];
};

type State = {
  showDetails: boolean[];
};

class ScenarioResults extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      showDetails: this.props.scenarioSteps.map((e) => false)
    }
  }

  toggleShowDetails = (e: MouseEvent, index: number) => {
    if (!e.currentTarget) {
      return;
    }
    e.preventDefault();

    const updatedShowDetails = [
      ...this.state.showDetails.slice(0, index),
      !this.state.showDetails[index],
      ...this.state.showDetails.slice(index + 1)
    ]

    this.setState({ showDetails: updatedShowDetails });
  }

  //: React.SFC<Props> = ({ scenarioName, scenarioSteps, scenarioStepResults }) => {
  render() {
    const { scenarioName, scenarioSteps, scenarioStepResults } = this.props;

    function resultOutputToString(output: any): string {
      if (typeof output === 'string') {
        return output;
      }

      return JSON.stringify(output);
    }

    return (
      <IonList>
        <IonListHeader color="light">
          <IonLabel>Steps for {scenarioName}</IonLabel>
        </IonListHeader>
        {scenarioSteps.map((step, index) => (
          <IonItem
            key={step.name}
          >
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <h3>{step.name}</h3>
                    <p>{step.description}</p>
                    {scenarioStepResults[index] && (
                      <IonText
color={scenarioStepResults[index].isError ? 'danger' : scenarioStepResults[index].status ? 'success' : 'warning'}>
                        {scenarioStepResults[index].isError
                          ? "Result: failure, message: " + scenarioStepResults[index].message
                          : scenarioStepResults[index].status
                            ? "Result: success, status code: " + scenarioStepResults[index].status
                            : "Result: cancelled"
                        }
                      </IonText>
                    )}
                  </IonLabel>
                </IonCol>
                <IonCol>
                {scenarioStepResults[index] && scenarioStepResults[index].status && (
                  <IonButton class="ion-float-right" size="default" color="secondary" style={{textTransform: 'none'}}
                      onClick={(e) => this.toggleShowDetails(e, index)}>

                    {this.state.showDetails[index] ? (
                      <>hide details&nbsp;<IonIcon name="arrow-dropleft"></IonIcon></>
                    ) : (
                      <>show details&nbsp;<IonIcon name="arrow-dropright"></IonIcon></>
                    )}
                  </IonButton>
                )}
                </IonCol>
              </IonRow>

              {this.state.showDetails[index] && (
                <IonRow>
                  <IonCol>
                    <IonCard>
                      <IonCardHeader>
                        <IonCardSubtitle>
                          Output
                        </IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <code>
                          {resultOutputToString(scenarioStepResults[index].output)}
                        </code>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
          </IonItem>
        ))}
      </IonList>
    )
  }
}

export default ScenarioResults;

