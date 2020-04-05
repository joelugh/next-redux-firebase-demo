import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebaseConnect } from 'react-redux-firebase';
import { Typography, Card } from '@material-ui/core';

function getLines(face) {

    function getLine(start,end,join=false) {
        const line = {
            x: face.x.slice(start,end),
            y: face.y.slice(start,end)
        }
        if (join) {
            line.x.push(face.x[start]);
            line.y.push(face.y[start]);
        }
        return line;
    }

    return [
        getLine(0, 17),  // jaw
        getLine(17, 22), // left eye brow
        getLine(22, 27), // right eye brow
        getLine(27, 36), // nose
        getLine(36, 42, true), // left eye
        getLine(42, 48, true), // right eye
        getLine(48, 68, true), // mouth
    ];
}

function Face({id, me}){

    useFirebaseConnect([
        `face/${id}`,
        `users/${id}/name`
    ]);

    const face = useSelector(state => id && state.firebase.data.face && state.firebase.data.face[id]);
    const name = useSelector(state => id && state.firebase.data.users && state.firebase.data.users[id] && state.firebase.data.users[id].name);

    if (!face) return null;
    const lines = getLines(face);

    function moveTo(str,x,y) {
        str += `M ${x},${y} `;
        return str;
    }

    function lineTo(str,x,y) {
        str += `L ${x},${y} `;
        return str;
    }

    return <Card style={{display:'flex', flexDirection:'column', alignItems:'center', margin: 3, height: 180}}>
        <svg viewBox="0 0 200 200" width="150" height="150">
            {lines.map((line,idx) => {
                let d = "";
                d = moveTo(d, line.x[0], line.y[0]);
                for(let i = 1; i < line.x.length; i++) {
                    d = lineTo(d, line.x[i], line.y[i]);
                }
                return <path key={idx} d={d} fill="none" stroke="black" style={{transition: `d 0.2s`}} />
            })}
            {/* <text
                x={face.box.x - face.box.width}
                y={face.box.y + face.box.height+20}
                style={{font: "bold 10px sans-serif"}}
            >{name && name.split(" ")[0]}</text> */}
        </svg>
        <Typography variant="h6">{name && name.split(" ")[0]}</Typography>
    </Card>
}

export default Face;