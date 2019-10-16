import React, { Component } from 'react';
import * as Google from 'expo-google-app-auth';
import { Text, View, Button, TextInput } from 'react-native';
import { GOOGLE_AUTH_IOS_CLIENT_ID } from 'react-native-dotenv';
import { connect } from 'react-redux'
import { auth } from '../utils/firebase';
import styles from '../styles/main';
import { authUser } from '../redux';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.auth = this.auth.bind(this);
    this.authGoogle = this.authGoogle.bind(this);
    this.state = {
      email: null,
      password: null,
      accessToken: null,
      user: auth.currentUser || null,
      error: null,
      posts: null
    };
  }

  onChangeEmail(email) {
    this.setState({ email });
  }

  onChangePassword(password) {
    this.setState({ password });
  }

  login() {
    if (this.state.error) {
      this.setState({ error: null });
    }
    const { email, password } = this.state;
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log('firebase err:', error.message);
        this.setState({
          error: error.message
        });
      });
  }

  logout() {
    auth.signOut()
      .catch( (error)=>{
        this.setState({
          error: error.message
        });
      });
  }

  auth() {
    const { authUser } = this.props;
    const { email, password, error } = this.state;
    if (error) {
      this.setState({ error: null });
    }
    authUser(email, password);
  }

  async authGoogle() {
    if (this.state.error) {
      this.setState({ error: null });
    }
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        iosClientId: GOOGLE_AUTH_IOS_CLIENT_ID,
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        const { idToken, accessToken, user } = result;
        this.setState({ accessToken });
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
        auth.signInWithCredential(credential)
          .catch(error => {
            this.setState({
              error: error.message
            });
          });
      } else {
        this.setState({
          error: result.type
        });
      }
    } catch (error) {
      this.setState({
        error: error.message
      });
    }
  }

  render() {
    const { email, password, error } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text>login</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1
            }}
            autoCapitalize='none'
            autoCompleteType='email'
            value={email}
            onChangeText={this.onChangeEmail}
          />
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1
            }}
            secureTextEntry={true}
            autoCapitalize='none'
            autoCompleteType='password'
            value={password}
            onChangeText={this.onChangePassword}
          />
          <Button
            title='ok'
            onPress={this.login}
          />
        </View>
        <View>
          <Text>signup</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1
            }}
            autoCapitalize='none'
            autoCompleteType='email'
            value={email}
            onChangeText={this.onChangeEmail}
          />
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1
            }}
            secureTextEntry={true}
            autoCapitalize='none'
            autoCompleteType='password'
            value={password}
            onChangeText={this.onChangePassword}
          />
          <Button
            title='start'
            onPress={this.auth}
          />
          <Button
            title='start with google'
            onPress={this.authGoogle}
          />
        </View>
        {error ? <Text>{error}</Text> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data
});

const mapDispatchToProps = {
  authUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
