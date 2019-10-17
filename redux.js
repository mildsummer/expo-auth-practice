import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import firebase, { auth } from './utils/firebase';
import * as Google from 'expo-google-app-auth';
import { GOOGLE_AUTH_IOS_CLIENT_ID } from 'react-native-dotenv';
import {Alert} from "react-native";

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

export const authGoogle = () => async (dispatch) => {
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
    type: 'START_AUTH_USER'
  });
  auth.signOut()
    .catch(({ message}) => {
      dispatch({
        type: 'FAIL_SIGN_OUT',
        message
      });
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
      'Email verification is required',
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

const INITIAL_STATE = {
  data: null,
  authError: null,
  signOutError: null
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
    case 'FAIL_SIGN_OUT':
      return { ...state, signOutError: action.message };
    default:
      return state;
  }
};

export const reducers = combineReducers({
  user: reducer
});

export const store = createStore(reducers, applyMiddleware(thunk));

auth.onAuthStateChanged((user) => {
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
