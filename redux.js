import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Alert } from 'react-native';
import { Linking } from 'expo'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-google-app-auth';
import { GOOGLE_AUTH_IOS_CLIENT_ID, CAPTCHA_URL_BASE } from 'react-native-dotenv';
import firebase, { auth, db } from './utils/firebase';

export const signIn = (email, password) => (dispatch) => {
  dispatch({
    type: 'START_AUTH_USER'
  });
  auth.signInWithEmailAndPassword(email, password)
    .catch(({ message}) => {
      dispatch({
        type: 'FAIL_AUTH_USER',
        message
      });
    });
};

export const authUser = (email, password) => (dispatch) => {
  dispatch({
    type: 'START_AUTH_USER'
  });
  auth.createUserWithEmailAndPassword(email, password)
    .catch(({ message }) => {
      dispatch({
        type: 'FAIL_AUTH_USER',
        message
      });
    });
};

export const authGoogle = () => (dispatch) => {
  dispatch({
    type: 'START_AUTH_USER'
  });
  Google.logInAsync({
    behavior: 'web',
    iosClientId: GOOGLE_AUTH_IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  }).then((result) => {
    if (result.type === 'success') {
      const { idToken, accessToken } = result;
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      auth.signInWithCredential(credential)
        .catch(({ message }) => {
          dispatch({
            type: 'FAIL_AUTH_USER',
            message
          });
        });
    } else {
      dispatch({
        type: 'FAIL_AUTH_USER',
        message: result.type
      });
    }
  }).catch(({ message }) => {
      dispatch({
        type: 'FAIL_AUTH_USER',
        message
      });
    });
};

export const signOut = () => (dispatch) => {
  dispatch({
    type: 'START_SIGN_OUT_USER'
  });
  auth.signOut()
    .catch(({ message}) => {
      Alert.alert(message);
    });
};

export const sendPasswordResetEmail = () => (dispatch) => {
  const email = store.getState().user.data && store.getState().user.data.email;
  if (email) {
    Alert.alert(
      'Reset Password',
      'We will email you instructions on how to reset your password.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            auth.sendPasswordResetEmail(email).then(() => {
              Alert.alert('The email has been sent to your account.');
            }).catch(function({ message }) {
              Alert.alert(message);
            });
          }
        },
      ]
    );
  }
};

export const verifyEmail = () => (dispatch) => {
  const user = store.getState().user.data;
  if (user) {
    Alert.alert(
      'Email verification',
      'We will send a verification link to your email account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            user.sendEmailVerification().then(() => {
              Alert.alert('The email has been sent.');
            }).catch(function({ message }) {
              Alert.alert(message);
            });
          }
        },
      ]
    );
  }
};

export const verifyPhoneNumber = (phoneNumber) => (dispatch) => {
  const captchaUrl = `${CAPTCHA_URL_BASE}?appurl=${Linking.makeUrl('')}`;
  const listener = ({ url }) => {
    WebBrowser.dismissBrowser();
    const tokenEncoded = Linking.parse(url).queryParams['token'];
    if (tokenEncoded) {
      const token = decodeURIComponent(tokenEncoded);
      //fake firebase.auth.ApplicationVerifier
      const captchaVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(token)
      };
      auth.signInWithPhoneNumber(phoneNumber, captchaVerifier).then((confirmationResult) => {
        dispatch({
          type: 'CONFIRM_PHONE_NUMBER',
          phoneNumberConfirmation: confirmationResult
        });
      }).catch(function({ message }) {
        Alert.alert(message);
      });
    }
  };
  Linking.addEventListener('url', listener);
  WebBrowser.openBrowserAsync(captchaUrl).then(() => {
    Linking.removeEventListener('url', listener);
  });
};

export const confirmPhoneNumberVerification = (verificationCode) => (dispatch) => {
  const state = store.getState().user;
  const phoneNumberConfirmation = state.phoneNumberConfirmation;
  const user = state.data;
  const credential = firebase.auth.PhoneAuthProvider.credential(phoneNumberConfirmation.verificationId, verificationCode);
  user.linkWithCredential(credential).then((userCredential) => {
    dispatch({
      type: 'SUCCESS_CONFIRM_PHONE_NUMBER',
      user: userCredential.user
    });
  }).catch(function({ message }) {
    Alert.alert(message);
  });
};

export const getPosts = (lengthPerPage, startAfter) => (dispatch) => {
  const user = store.getState().user.data;
  if (user) {
    db.collection('/users')
      .doc(user.uid)
      .get()
      .then((userSnapshot) => {
        dispatch({
          type: 'SUCCESS_GET_USER',
          data: userSnapshot.data()
        });
        let ref = db.collection('/posts')
          .where('author', '==', user.uid)
          .orderBy('order')
          .limit(lengthPerPage);
        if (startAfter) {
          ref = ref.startAfter(startAfter);
        }
        ref.get()
          .then((querySnapshot) => {
            dispatch({
              type: 'SUCCESS_GET_POSTS',
              posts: querySnapshot.docs
            });
          })
          .catch(({ message }) => {
            Alert.alert(message);
          });
      })
      .catch(({ message }) => {
        Alert.alert(message);
      });
  }
};

const INITIAL_STATE = {
  data: null,
  dbData: null,
  authError: null,
  posts: null,
  phoneNumberConfirmation: null
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'START_AUTH_USER':
      return { ...state, error: null };
    case 'SUCCESS_AUTH_USER':
      return { ...state, data: action.data };
    case 'SIGN_OUT_USER':
      return { ...state, data: null };
    case 'FAIL_AUTH_USER':
      return { ...state, authError: action.message };
    case 'SUCCESS_GET_USER':
      return { ...state, dbData: action.data };
    case 'SUCCESS_GET_POSTS':
      return {
        ...state,
        posts: (state.posts || []).concat(action.posts)
      };
    case 'CONFIRM_PHONE_NUMBER':
      return {
        ...state,
        phoneNumberConfirmation: action.phoneNumberConfirmation
      };
    case 'SUCCESS_CONFIRM_PHONE_NUMBER':
      return {
        ...state,
        phoneNumberConfirmation: null,
        data: action.user
      };
    default:
      return state;
  }
};

export const reducers = combineReducers({
  user: reducer
});

export const store = createStore(reducers, applyMiddleware(thunk));

auth.onAuthStateChanged((user) => {
  console.log('auth state changed', user);
  const current = store.getState().user.data;
  if (!current && user) {
    store.dispatch({
      type: 'SUCCESS_AUTH_USER',
      data: user
    });
  } else if (current && !user) {
    store.dispatch({
      type: 'SIGN_OUT_USER'
    });
  }
});
