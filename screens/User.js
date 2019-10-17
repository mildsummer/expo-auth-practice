import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
// import { db } from '../utils/firebase';
import styles from '../styles/main';
import { signOut, sendPasswordResetEmail, verifyEmail } from '../redux';

class User extends Component {
  constructor(props) {
    super(props);
    this.goToList = this.goToList.bind(this);
    const { user } = props;
    // db.collection('/posts')
    //   .where('author', '==', user.uid)
    //   .get()
    //   .then((querySnapshot) => {
    //     this.setState({ posts: querySnapshot.docs });
    //   })
    //   .catch((error) => {
    //     this.setState({ error: error.message });
    //   });
    this.state = {
      error: null,
      posts: null,
      user
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

  // verifyPhoneNumber() {
  //   auth.signInWithPhoneNumber('', this.recaptchaVerifier)
  //     .then(confirmationResult => {
  //       this.confirmationResult = confirmationResult;
  //     }).catch(error => {
  //       this.setState({ error: error.message });
  //     });
  // }

  render() {
    const { signOut, error, sendPasswordResetEmail } = this.props;
    const { posts, user } = this.state;
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
              onPress={this.sendEmailVerification}
            />
          )}
          <Button
            ref={(ref) => {
              if (ref) {
                this.verifyPhoneNumberButton = ref;
              }
            }}
            title='Phone verification'
            onPress={this.verifyPhoneNumber}
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
          {posts ? posts.map((post) => (
            <Text key={post.id}>
              {post.data().text}
            </Text>
          )) : null}
          {error ? <Text>{error}</Text> : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  error: state.user.signOutError
});

const mapDispatchToProps = {
  signOut,
  verifyEmail,
  sendPasswordResetEmail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
