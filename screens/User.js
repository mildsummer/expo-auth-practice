import React, { Component } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { connect } from 'react-redux';
import { auth, db } from '../utils/firebase';
import styles from '../styles/main';
import { signOut } from '../redux';

class User extends Component {
  constructor(props) {
    super(props);
    this.sendEmailVerification = this.sendEmailVerification.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    const { user } = props;
    db.collection('/posts')
      .where('author', '==', user.uid)
      .get()
      .then((querySnapshot) => {
        this.setState({ posts: querySnapshot.docs });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
    this.state = {
      error: null,
      posts: null,
      user
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.state.user) {
      this.setState({
        user: nextProps.user
      });
    }
  }

  sendEmailVerification() {
    const { user } = this.props;
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
    const { signOut, error } = this.props;
    const { posts, user } = this.state;
    const isEmailVerified = user && user.emailVerified;
    console.log(user, posts);
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
          onPress={signOut}
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

const mapStateToProps = state => ({
  user: state.user.data,
  error: state.user.signOutError
});

const mapDispatchToProps = {
  signOut
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
