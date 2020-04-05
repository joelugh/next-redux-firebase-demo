import React from 'react';
import { useSelector } from 'react-redux';
import { useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Webcam from '../../components/Webcam';
import Faces from '../../components/Faces';
import { getDB } from '../../_firebase';
import useScript from '../../utils/useScript';

const SpacePage = () => {

    const router = useRouter();
    const { id } = router.query;

    const auth = useSelector(state => state.firebase.auth);
    const user = useSelector(state => state.firebase.profile);

    const [loaded, error] = useScript('/face-api.js');

    React.useEffect(() => {
        if (isLoaded(user) && !isEmpty(user)) {
            const connectedRef = getDB().ref(`space/${id}/faces/${user.id}`);
            connectedRef.set(true)
            connectedRef.onDisconnect().remove();
        }
    }, [user])

    if(!isLoaded(user)) return null;

    return <>
        <Header />
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        {loaded && <Webcam id={id}/>}
            <Faces id={id} />
        </div>;
    </>

}

export default SpacePage;