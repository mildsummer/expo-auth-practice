import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { auth } from './utils/firebase';

export const authUser = (email, password) => (dispatch) => {
  dispatch({
    type: 'START_AUTH_USER'
  });
  auth.createUserWithEmailAndPassword(email, password)
    .catch(error => {
      console.log('firebase err:', error.message);
    });
};

const INITIAL_STATE = {
  data: null
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SUCCESS_AUTH_USER':
      return { ...state, data: action.data };
    default:
      return state;
  }
};

export const reducers = combineReducers({
  user: reducer
});

export const store = createStore(reducers, applyMiddleware(thunk));

auth.onAuthStateChanged((user) => {
  if (!store.getState().user.data && user) {
    store.dispatch({
      type: 'SUCCESS_AUTH_USER',
      data: user
    });
  }
});
