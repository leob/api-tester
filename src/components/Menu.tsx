import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { IonIcon, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
         IonList, IonListHeader, IonItem, IonLabel, IonNote, IonMenuToggle } from '@ionic/react';

import { connect } from 'react-redux';
import { RootState } from '../store';

import { Session } from '../store/sessions/types';

const mapStateToProps = (state: RootState) => ({
  sessions: state.sessions.sessions
});

type Props = RouteComponentProps<{}> & ReturnType<typeof mapStateToProps>;
//type Props = RouteComponentProps<{}>;

const routes = {
  appPages: [
    { title: 'Scenarios', path: '/', icon: 'calendar' },
    { title: 'About', path: '/about', icon: 'information-circle' }
  ]
};

const Menu: React.SFC<Props> = ({ history, sessions }) => {

  function renderListItems(list: any[]) {
    return list
      .filter(route => !!route.path)
      .map((p) => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem button onClick={() => history.push(p.path)}>
            <IonIcon slot="start" name={p.icon}></IonIcon>
            <IonLabel>
              {p.title}
            </IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  function renderSessionItems(sessions: Session[]) {
    return sessions
      .map((session, index) => (
        <IonMenuToggle key={session.id} auto-hide="false">
          <IonItem button onClick={() => selectSession(session)}>
            <IonIcon slot="start" name="list-box"></IonIcon>
            <IonLabel>
              {session.scenarioName}
            </IonLabel>
            <IonNote slot="end">
              {"(session " + (index+1) + ")"}
            </IonNote>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  function selectSession(session: Session) {
    history.push(`/sessions/${session.id}`);
  }

  const hasSessions = sessions.length > 0;

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="outer-content">
        <IonList>
          <IonListHeader>
            Navigate
          </IonListHeader>
          { renderListItems(routes.appPages) }
        </IonList>

        {hasSessions ? (
          <IonList>
            <IonListHeader>
              Sessions
            </IonListHeader>
            { renderSessionItems(sessions) }
          </IonList>
        ) : (
          <IonList lines="none"></IonList>
        )}

      </IonContent>
    </IonMenu>
  );
}

export default withRouter(connect(
  mapStateToProps
)(Menu));

