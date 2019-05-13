import React, { Component } from 'react';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
} from '@ionic/react';

class NotFound extends Component<{}, {}> {

  render() {

    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Page not found</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div className="ion-padding">
            <h4>Not Found</h4>

            <p>
              The page was not found
            </p>
          </div>
        </IonContent>
      </>
    );
  }
}

export default NotFound;

