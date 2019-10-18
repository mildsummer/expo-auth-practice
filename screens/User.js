import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Avatar, Input } from 'react-native-elements';
import { connect } from 'react-redux';
// import { db } from '../utils/firebase';
import styles from '../styles/main';
import { signOut, sendPasswordResetEmail, verifyEmail, verifyPhoneNumber, confirmPhoneNumberVerification } from '../redux';

class User extends Component {
  constructor(props) {
    super(props);
    this.goToList = this.goToList.bind(this);
    this.onChangePhoneNumberVerificationCode = this.onChangePhoneNumberVerificationCode.bind(this);
    this.confirmPhoneNumberVerification = this.confirmPhoneNumberVerification.bind(this);
    const { user } = props;
    this.state = {
      user,
      phoneNumberVerificationCode: null
    };
  }

  componentDidMount() {
    const { user } = this.state;
    if (!user.emailVerified) {
      this.props.verifyEmail();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.state.user) {
      this.setState({
        user: nextProps.user
      });
    }
  }

  goToList() {
    const { navigation } = this.props;
    navigation.navigate('List');
  }

  confirmPhoneNumberVerification() {
    const { phoneNumberVerificationCode } = this.state;
    const { confirmPhoneNumberVerification } = this.props;
    confirmPhoneNumberVerification(phoneNumberVerificationCode);
  }

  onChangePhoneNumberVerificationCode(phoneNumberVerificationCode) {
    this.setState({ phoneNumberVerificationCode });
  }

  render() {
    const { signOut, error, verifyEmail, phoneNumberConfirmation, sendPasswordResetEmail, verifyPhoneNumber } = this.props;
    const { user, phoneNumberVerificationCode } = this.state;
    return (
      <View style={styles.container}>
        <Avatar
          size='large'
          rounded
          source={{
            url: user.photoURL
          }}
        />
        <Text>{user.email}</Text>
        <View
          style={{
            width: '100%'
          }}
        >
          {user.emailVerified ? null : (
            <Button
              title='Email verification'
              onPress={verifyEmail}
            />
          )}
          <Button
            title='Phone verification'
            onPress={verifyPhoneNumber}
          />
          <Button
            title='Reset password'
            onPress={sendPasswordResetEmail}
          />
          <Button
            title='Sign out'
            onPress={signOut}
          />
          <Button
            title="Go to list"
            onPress={this.goToList}
          />
          {phoneNumberConfirmation ? (
            <View>
              <Input
                autoCapitalize='none'
                containerStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginBottom: 32
                }}
                label='Enter the verification code'
                value={phoneNumberVerificationCode}
                onChangeText={this.onChangePhoneNumberVerificationCode}
              />
              <Button
                title='OK'
                onPress={this.confirmPhoneNumberVerification}
                disabled={!phoneNumberVerificationCode}
              />
            </View>
          ) : null}
          {error ? <Text>{error}</Text> : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  phoneNumberConfirmation: state.user.phoneNumberConfirmation
});

const mapDispatchToProps = {
  signOut,
  verifyEmail,
  verifyPhoneNumber,
  sendPasswordResetEmail,
  confirmPhoneNumberVerification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
