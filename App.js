import React, { Component } from 'react';
import { ThemeProvider } from 'react-native-elements';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect, Provider } from 'react-redux'
import './utils/firebase';
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
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    User: {
      screen: User,
      navigationOptions:  {
        title: 'User page',
        headerLeft: null
      }
    }
  }
));

const AppContainer = connect(mapStateToProps, {})(
  class extends Component {
    componentWillReceiveProps(nextProps) {
      const { user } = this.props;
      if (user && !nextProps.user) {
        this.navigate('Login');
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
        <ThemeProvider>
          <AppContainer />
        </ThemeProvider>
      </Provider>
    );
  }
}
