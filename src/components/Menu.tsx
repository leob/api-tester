import React from 'react';
import { IonIcon, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
         IonList, IonListHeader, IonItem, IonItemDivider, IonLabel, IonMenuToggle } from '@ionic/react';
import { RouteComponentProps, withRouter } from 'react-router';

const routes = {
  appPages: [
    { title: 'Scenarios', path: '/', icon: 'calendar' },
    { title: 'About', path: '/about', icon: 'information-circle' }
  ]
}

type Props = RouteComponentProps<{}>;

const Menu: React.SFC<Props> = ({ history }) => {

  function renderlistItems(list: any[]) {
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
          { renderlistItems(routes.appPages) }
        </IonList>
        <IonList lines="none"></IonList>
      </IonContent>
    </IonMenu>
  );
}

export default withRouter(Menu);

