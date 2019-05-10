import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';

import {
  IonApp,
  IonPage
} from '@ionic/react';

import store from './store';
import Main from './pages/Main';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <IonApp>
            <IonPage id="main">
              <Switch>
                <Route path="/" component={Main} />
              </Switch>
            </IonPage>
          </IonApp>
        </Router>
      </Provider>
    );
  }
}

export default App;
