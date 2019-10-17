import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { GOOGLE_AUTH_IOS_CLIENT_ID } from 'react-native-dotenv';
import { connect } from 'react-redux'
import styles from '../styles/main';
import { authUser, signIn, authGoogle } from '../redux';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.signIn = this.signIn.bind(this);
    this.auth = this.auth.bind(this);
    this.authGoogle = this.authGoogle.bind(this);
    this.state = {
      email: null,
      password: null
    };
  }

  onChangeEmail(email) {
    this.setState({ email });
  }

  onChangePassword(password) {
    this.setState({ password });
  }

  signIn() {
    const { signIn } = this.props;
    const { email, password } = this.state;
    signIn(email, password);
  }

  auth() {
    const { authUser } = this.props;
    const { email, password } = this.state;
    authUser(email, password);
  }

  authGoogle() {
    const { authGoogle } = this.props;
    authGoogle();
  }

  render() {
    const { error } = this.props;
    const { email, password } = this.state;
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
            onPress={this.signIn}
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
  user: state.user.data,
  error: state.user.authError
});

const mapDispatchToProps = {
  authUser,
  signIn,
  authGoogle
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
