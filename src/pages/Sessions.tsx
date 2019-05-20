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
  IonItem,
  IonNote
} from '@ionic/react';

import { connect } from 'react-redux';
import { RootState } from '../store';

import { Session } from '../store/sessions/types';

const mapStateToProps = (state: RootState) => ({
  sessions: state.sessions.sessions
});

type Props = RouteComponentProps<{}> & ReturnType<typeof mapStateToProps>;

class Sessions extends Component<Props, {}> {

  selectSession = (e: MouseEvent, session: Session) => {
    if (!e.currentTarget) {
      return;
    }
    e.preventDefault();

    this.props.history.push(`/sessions/${session.id}`);
  };

  render() {

    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Sessions</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonListHeader color="light">
              <IonLabel>Sessions</IonLabel>
            </IonListHeader>
            {this.props.sessions.length === 0 ? (
                <IonItem>
                  <IonLabel>
                    <h3>No sessions</h3>
                  </IonLabel>
                </IonItem>
            ) : (
              this.props.sessions.map((session, index) => (
                <IonItem
                  href="#"
                  key={session.id}
                  onClick={(e) => this.selectSession(e, session)}
                >
                  <IonLabel>
                    <h3>{session.scenarioName}</h3>
                  </IonLabel>
                  <IonNote slot="end">
                    {"(session " + (index+1) + ")"}
                  </IonNote>
                </IonItem>
            )))}
            </IonList>
        </IonContent>
      </>
    );
  }
}

export default withRouter(connect(
  mapStateToProps
)(Sessions));

