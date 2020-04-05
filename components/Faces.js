import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import Face from './Face';
import Invite from './Invite';
import Blank from './Blank';

function Faces({id}){

    useFirebaseConnect([
        `space/${id}/faces/`,
    ]);

    const faces = useSelector(state => state.firebase.data.space && state.firebase.data.space[id] && state.firebase.data.space[id].faces);
    const user = useSelector(state => state.firebase.profile);


    if (isLoaded(faces) && !isEmpty(faces)) {
        return <div style={{display:'flex', width:'100vw', flexWrap: "wrap", justifyContent:'center'}}>
            {Object.keys(faces).map(id => <Face key={id} id={id} me={user.id == id} />)}
            <Invite />
            {Object.keys(faces).length % 2 == 0 && <Blank/>}
        </div>
    }

    return null;
}

export default Faces;