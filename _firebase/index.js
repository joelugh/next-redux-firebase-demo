import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import "firebase/messaging";

import firebaseConfig from '../firebaseConfig';

export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();

export const batchUpdate = async (paths = {}, _rootRef) => {
  const rootRef = _rootRef || getDB().ref()
  await rootRef.update(paths)
}

export const getFirebase = () => {

  if (!firebaseConfig) {
    console.warn('Cannot initialise firebase without config variables. Skipping initialisation.')
    return firebase;
  }

  // get firebase config
  try {
    if (firebase.apps.length === 0) {
      console.log('Initialising firebase:', firebaseConfig.databaseURL, firebaseConfig.storageBucket)
      firebase.initializeApp(firebaseConfig);
    }
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack);
    }
  }

  return firebase;
};

export const getDB = () => getFirebase().database();

export const getAuth = () => getFirebase().auth();

export const signOut = async (space) => {
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  if (space && uid) {
    const spaceRef = getDB().ref(`space/${space}/faces/${uid}`);
    await spaceRef.remove();
  }
  auth.signOut()
}

export const signInWithGoogle = async (space) => {

  const auth = getAuth();
  const uid = auth.currentUser.uid;
  if (space && uid) {
    const spaceRef = getDB().ref(`space/${space}/faces/${uid}`);
    await spaceRef.remove();
  }

  auth.signInWithPopup(GoogleProvider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

getAuth().onAuthStateChanged(_user => {
  if (_user) {
    const providerUser = {
      id: _user.uid,
      name: _user.displayName || "Anon Ymous",
      email: _user.email,
      emailVerified: _user.emailVerified,
      photo: _user.photoURL,
      created: _user.metadata.creationTime,
      last: _user.metadata.lastSignInTime,
      isAnonymous: _user.isAnonymous,
    }
    console.log('providerUser', providerUser);

    const userRef = getDB().ref(`users/${providerUser.id}`);
    userRef.once('value', snapshot => {
        const user = snapshot.val();
        userRef.update({
            ...(user || {}),
            ...providerUser,
        });
    });
  } else {
    getAuth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ...
    });
  }

});


export default getFirebase;