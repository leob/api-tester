import React, { Component } from 'react';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
} from '@ionic/react';

import config from '../config';

class Aboout extends Component<{}, {}> {

  render() {

    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>About</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div className="ion-padding">
            <h4>{config.APP_TITLE}</h4>

            <p>
              This is the API tester
            </p>
          </div>
        </IonContent>
      </>
    );
  }
}

export default Aboout;

