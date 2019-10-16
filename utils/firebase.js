import firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
