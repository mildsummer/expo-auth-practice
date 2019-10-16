import React, { Component } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { auth, db } from '../utils/firebase';
import styles from '../styles/main';

export default class User extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.auth = this.auth.bind(this);
    this.authGoogle = this.authGoogle.bind(this);
    this.sendEmailVerification = this.sendEmailVerification.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.state = {
      user: auth.currentUser || null,
      error: null,
      posts: null
    };
    auth.onAuthStateChanged((user) => {
      this.setState({ user: user || null });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.user && this.state.user) {
      db.collection('/posts')
        .where('author', '==', this.state.user.uid)
        .get()
        .then((querySnapshot) => {
          this.setState({ posts: querySnapshot.docs });
        })
        .catch((error) => {
          this.setState({ error: error.message });
        })
      ;
    }
  }

  logout() {
    auth.signOut()
      .catch( (error)=>{
        this.setState({
          error: error.message
        });
      });
  }

  sendEmailVerification() {
    const { user } = this.state;
    user.sendEmailVerification().then(() => {
      this.setState({ error: 'email sent' });
    }).catch(error => {
      // An error happened.
      this.setState({ error: error.message });
    });
  }

  resetPassword() {
    const { user } = this.state;
    auth.sendPasswordResetEmail(user.email).then(() => {
      // Email sent.
      this.setState({ error: 'email sent' });
    }).catch(function(error) {
      // An error happened.
      this.setState({ error: error.message });
    });
  }

  // verifyPhoneNumber() {
  //   auth.signInWithPhoneNumber('', this.recaptchaVerifier)
  //     .then(confirmationResult => {
  //       this.confirmationResult = confirmationResult;
  //     }).catch(error => {
  //       this.setState({ error: error.message });
  //     });
  // }

  render() {
    const { user, error, posts } = this.state;
    const isEmailVerified = user && user.emailVerified;
    return (
      <View style={styles.container}>
        <Image
          source={{ url: user.photoUrl }}
          style={{
            width: 100,
            height: 100
          }}
        />
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        <Text>email verified: {isEmailVerified.toString()}</Text>
        {isEmailVerified ? null : (
          <Button
            title='email verify'
            onPress={this.sendEmailVerification}
          />
        )}
        <Button
          ref={(ref) => {
            if (ref) {
              this.verifyPhoneNumberButton = ref;
            }
          }}
          title='phone verify'
          onPress={this.verifyPhoneNumber}
        />
        <Button
          title='reset password'
          onPress={this.resetPassword}
        />
        <Button
          title='sign out'
          onPress={this.logout}
        />
        {posts ? posts.map((post) => (
          <Text key={post.id}>
            {post.data().text}
          </Text>
        )) : null}
        {error ? <Text>{error}</Text> : null}
      </View>
    );
  }
}
