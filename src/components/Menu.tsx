import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { IonIcon, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
         IonList, IonListHeader, IonItem, IonLabel, IonMenuToggle } from '@ionic/react';

import { connect } from 'react-redux';
import { RootState } from '../store';

const mapStateToProps = (state: RootState) => ({
  sessions: state.sessions.sessions
});

type Props = RouteComponentProps<{}> & ReturnType<typeof mapStateToProps>;

const Menu: React.SFC<Props> = ({ history, sessions }) => {

  function renderListItems(numSessions: number) {

    const routes = [
      { title: 'Scenarios', path: '/', icon: 'calendar' },
      { title: 'Sessions (' + numSessions + ')', path: '/sessions', icon: 'list-box' },
      { title: 'About', path: '/about', icon: 'information-circle' }
    ];

    return routes
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
          { renderListItems(sessions.length) }
        </IonList>

        {/* Just to provide some spacing */}
        <IonList lines="none"></IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(connect(
  mapStateToProps
)(Menu));

