import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { IonIcon, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
         IonList, IonListHeader, IonItem, IonLabel, IonMenuToggle } from '@ionic/react';

type Props = RouteComponentProps<{}>;

const routes = {
  appPages: [
    { title: 'Scenarios', path: '/', icon: 'calendar' },
    { title: 'Sessions', path: '/sessions', icon: 'list-box' },
    { title: 'About', path: '/about', icon: 'information-circle' }
  ]
};

const Menu: React.SFC<Props> = ({ history }) => {

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

        {/* Just to provide some spacing */}
        <IonList lines="none"></IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);

