import React, { Component } from 'react';
import './utils/firebase';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect, Provider } from 'react-redux'
import { store } from './redux'

// screens
import Login from './screens/Login';
import User from './screens/User';

const mapStateToProps = state => ({
  user: state.user.data
});

const AppNavigator = createAppContainer(createStackNavigator(
  {
    Login: {
      screen: Login
    },
    User: {
      screen: User
    }
  }
));

const AppContainer = connect(mapStateToProps, {})(
  class extends Component {
    componentWillReceiveProps(nextProps) {
      const { user } = this.props;
      if (user && !nextProps.user) {
        this.navigate('Login')
      } else if (!user && nextProps.user) {
        this.navigate('User');
      }
    }

    navigate(routeName) {
      this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName }));
    }

    render() {
      return (
        <AppNavigator
          ref={(ref) => {
            if (ref) {
              this.navigator = ref;
            }
          }}
        />
      );
    }
  }
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
