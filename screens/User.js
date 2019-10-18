import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Avatar, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from '../styles/main';
import { signOut, sendPasswordResetEmail, verifyEmail, verifyPhoneNumber, confirmPhoneNumberVerification } from '../redux';

class User extends Component {
  constructor(props) {
    super(props);
    this.goToList = this.goToList.bind(this);
    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.onChangePhoneNumberVerificationCode = this.onChangePhoneNumberVerificationCode.bind(this);
    this.verifyPhoneNumber = this.verifyPhoneNumber.bind(this);
    this.confirmPhoneNumberVerification = this.confirmPhoneNumberVerification.bind(this);
    const { user } = props;
    this.state = {
      user,
      phoneNumber: null,
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

  verifyPhoneNumber() {
    const { verifyPhoneNumber } = this.props;
    const { phoneNumber } = this.state;
    verifyPhoneNumber(phoneNumber);
  }

  confirmPhoneNumberVerification() {
    const { phoneNumberVerificationCode } = this.state;
    const { confirmPhoneNumberVerification } = this.props;
    confirmPhoneNumberVerification(phoneNumberVerificationCode);
  }

  onChangePhoneNumber(phoneNumber) {
    this.setState({ phoneNumber })
  }

  onChangePhoneNumberVerificationCode(phoneNumberVerificationCode) {
    this.setState({ phoneNumberVerificationCode });
  }

  render() {
    const { signOut, verifyEmail, phoneNumberConfirmation, sendPasswordResetEmail } = this.props;
    const { user, phoneNumber, phoneNumberVerificationCode } = this.state;
    return (
      <View style={styles.container}>
        <Avatar
          size='large'
          rounded
          source={{
            url: user.photoURL
          }}
        />
        <Text
          style={{
            marginTop: 16,
            marginBottom: 16
          }}
        >{user.email}</Text>
        {user.phoneNumber ? (
          <Text
            style={{
              marginBottom: 16
            }}
          >{user.phoneNumber}</Text>
        ) : null}
        <View
          style={{
            width: '100%',
          }}
        >
          {user.emailVerified ? null : (
            <Button
              style={{
                marginBottom: 16
              }}
              title='Email verification'
              onPress={verifyEmail}
            />
          )}
          {user.phoneNumber ? null : (
            <Button
              style={{
                marginBottom: 16
              }}
              title='Phone verification'
              onPress={this.verifyPhoneNumber}
            />
          )}
          <Button
            style={{
              marginBottom: 16
            }}
            title='Reset password'
            onPress={sendPasswordResetEmail}
          />
          <Button
            style={{
              marginBottom: 16
            }}
            title='Sign out'
            onPress={signOut}
          />
          <Button
            title="Go to list"
            onPress={this.goToList}
          />
          {user.phoneNumber || phoneNumberConfirmation ? null : (
            <View
              style={{
                marginTop: 16
              }}
            >
              <Input
                autoCapitalize='none'
                containerStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginBottom: 32
                }}
                label='Your phone number'
                value={phoneNumber}
                onChangeText={this.onChangePhoneNumber}
              />
              <Button
                title='OK'
                onPress={this.verifyPhoneNumber}
                disabled={!phoneNumber}
              />
            </View>
          )}
          {phoneNumberConfirmation ? (
            <View
              style={{
                marginTop: 16
              }}
            >
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
