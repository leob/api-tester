import { hot } from "react-hot-loader";
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './theme.css';

import { IonApp, IonSplitPane, IonPage } from '@ionic/react';

import store from './store';

import Menu from './components/Menu';

import About from './pages/About';
import NotFound from './pages/NotFound';

import Scenarios from './pages/Scenarios';
import Sessions from './pages/Sessions';
import Session from './pages/Session';

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
                  <Route exact path="/" render={() => <Redirect to="/scenarios"/>}/>
                  <Route exact path="/scenarios" component={Scenarios} />
                  <Route exact path="/sessions" component={Sessions} />
                  <Route path="/sessions/:sessionId" component={Session} />
                  <Route path="/about" component={About} />
                  <Route component={NotFound} />
                </Switch>
              </IonPage>
            </IonSplitPane>
          </IonApp>
        </Router>
      </Provider>
    );
  }
}

// React hot reloading - this can be kept in production, no need to deactivate it
export default hot(module)(App);

