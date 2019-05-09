import React, { Component } from 'react';

import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem
} from '@ionic/react';

// import { History } from 'history';

import { connect } from 'react-redux';
import { RootState, selectors, actions } from '../store';

// import { Scenario } from './store/scenarios/types';

// interface BaseProps {
//   history: History;
// }

const mapStateToProps = (state: RootState) => ({
  scenarios: state.scenarios.scenarios,
  selectedScenario: selectors.scenarios.selected
});

const mapDispatchToProps = {
  updateScenarios: (/*dummyTestValue*/) => actions.scenarios.updateScenarios(/*dummyTestValue*/)  //,
  // setSelectedScenario: (scenario: Scenario) => actions.scenarios.setSelectedScenario(scenario),
}

// type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
type Props = {} & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  // isRefreshing: boolean,
  // showLoading: boolean,
  // showFilterModal: boolean,
  // loadingMessage: string
}

class Main extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    props.updateScenarios(/*"a dummy test value, not used"*/);

    // this.ionRefresherRef = React.createRef<HTMLIonRefresherElement>();
    // this.ionFabRef = React.createRef<HTMLIonFabElement>();
  }

  goToLink(e: MouseEvent) {
    if (!e.currentTarget) {
      return;
    }
    e.preventDefault();
    // history.push((e.currentTarget as HTMLAnchorElement).href);
  }

  render() {
    return (
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Testing against: {process.env.REACT_APP_API_URL}</IonCardSubtitle>
            <IonCardTitle>{process.env.REACT_APP_TITLE}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {this.props.scenarios.map(scenario => (
                <IonItem
                  href={`/scenarios/${scenario.name}`}
                  key={scenario.name}
                  onClick={this.goToLink}
                >
                  <h3>{scenario.name}</h3>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);

