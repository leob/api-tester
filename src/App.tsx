import React, { Component } from 'react';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';

import {
  IonApp,
  IonPage
} from '@ionic/react';

import Main from './components/Main';
// import { History } from 'history';

import { Provider } from 'react-redux';

import store from './store';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <IonApp>
          <IonPage id="main">
            <Main></Main>
          </IonPage>
        </IonApp>
      </Provider>
    );
  }
}

export default App;
