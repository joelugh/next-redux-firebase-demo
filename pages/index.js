import React from 'react';
import { useSelector } from 'react-redux';
import { useFirebaseConnect } from 'react-redux-firebase';
import { Button } from '@material-ui/core';
import { getAuth, GoogleProvider } from '../_firebase';

function Index() {

    const auth = useSelector(state => state.firebase.auth);
    const user = useSelector(state => state.firebase.profile);

    console.log('auth', auth); /* {isLoaded: false, isEmpty: true} */
    console.log('user', user); /* {isLoaded: true, isEmpty: true} */

    return <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <h1>Hello{user.name ? ` ${user.name}` : ''}!</h1>
        <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
                getAuth().signInWithPopup(GoogleProvider).then(function(result) {
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
            }}
        >Sign In</Button>
    </div>;

}

export default Index;