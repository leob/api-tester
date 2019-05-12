import React, { Component } from 'react';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
} from '@ionic/react';

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
            <h4>Umpyre API tester</h4>

            <p>
              This is the Umpyre API tester
            </p>
          </div>
        </IonContent>
      </>
    );
  }
}

export default Aboout;

