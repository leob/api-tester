import React from 'react';

import {
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonText
} from '@ionic/react';

import { ScenarioStep, ScenarioStepResult } from '../lib/types';

type Props = {
  scenarioName: string;
  scenarioSteps: ScenarioStep[];
  scenarioStepResults: ScenarioStepResult[];
};

const ScenarioResults: React.SFC<Props> = ({ scenarioName, scenarioSteps, scenarioStepResults }) => {

  return (
      <IonList>
        <IonListHeader color="light">
          <IonLabel>Steps for {scenarioName}</IonLabel>
        </IonListHeader>
        { scenarioSteps.map((step, index) => (
            <IonItem
              key={step.name}
            >
              <IonLabel>
                <h3>{step.name}</h3>
                <p>{step.description}</p>
                { scenarioStepResults[index] && (

                  <IonText color={ scenarioStepResults[index].isError ? 'danger' : 'success'}>
                    { scenarioStepResults[index].isError
                      ? "Result: failure, message: " + scenarioStepResults[index].error
                      : "Result: success, status code: " + scenarioStepResults[index].status}
                  </IonText>
            )}
              </IonLabel>
            </IonItem>
        ))}
      </IonList>
  );
};

export default ScenarioResults;

