import React from 'react';
import { useSelector } from 'react-redux';
import { useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import Router, { useRouter } from 'next/router'
import shortid from 'shortid';

import { Button, LinearProgress } from '@material-ui/core';
import { getAuth, GoogleProvider, getDB } from '../_firebase';
import useScript from '../utils/useScript';
import Header from '../components/Header';
import Webcam from '../components/Webcam';
import Faces from '../components/Faces';



function Index() {

    const router = useRouter();
    const { space } = router.query;

    console.log('space', space);

    const routerLoaded = router && router.query;
    const isClient = typeof window !== 'undefined';
    const isValidSpace = space && shortid.isValid(space);

    const auth = useSelector(state => state.firebase.auth);
    const user = useSelector(state => state.firebase.profile);

    const isAuthenticated = isLoaded(user) && !isEmpty(user);

    const [loaded, error] = useScript('/face-api.js');

    React.useEffect(() => {
        if (loaded && routerLoaded && isClient && !isValidSpace) {
            Router.push({
                pathname: '/',
                query: { space: shortid.generate() },
            });
        }
    }, [router, space, loaded]);


    React.useEffect(() => {
        if (isAuthenticated) {
            const connectedRef = getDB().ref(`space/${space}/faces/${user.id}`);
            connectedRef.set(true)
            connectedRef.onDisconnect().remove();
        }
    }, [user])

    if(!isLoaded(user) || !isValidSpace) return <LinearProgress color="secondary" />;

    return <>
        <Header space={space} />
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <Faces id={space} />
        </div>
        {loaded && isAuthenticated && <Webcam id={space}/>}
    </>

}

export default Index;