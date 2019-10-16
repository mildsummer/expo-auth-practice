import React, { Component } from 'react';
import './utils/firebase';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux'
import { store } from './redux'

// screens
import Login from './screens/Login';
import User from './screens/User';

const HomeTab = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    User: {
      screen: User
    }
  }
);

const AppContainer = createAppContainer(HomeTab);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
