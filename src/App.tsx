import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './theme.css';

import { IonApp, IonSplitPane, IonPage, IonRouterOutlet } from '@ionic/react';

import store from './store';

import Menu from './components/Menu';

import Main from './pages/Main';
import About from './pages/About';
import ScenarioDetail from './pages/ScenarioDetail';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <IonApp>
            <IonSplitPane contentId="main">
              <Menu />
              <IonPage id="main">
                <Switch>
                  <Route path="/" component={Main} exact={true} />
                  <Route path="/scenarios/:name" component={ScenarioDetail} />
                  <Route path="/about" component={About} />
                </Switch>
              </IonPage>
            </IonSplitPane>
          </IonApp>
        </Router>
      </Provider>
    );
  }
}

export default App;
