import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebaseConnect } from 'react-redux-firebase';
import { Typography } from '@material-ui/core';

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

function drawLines(context, lines) {

    function drawLine(line) {
        context.beginPath();
        context.moveTo(line.x[0], line.y[0]);
        for(let i = 1; i < line.x.length; i++) {
            context.lineTo(line.x[i], line.y[i]);
        }
        context.stroke();
    }

    lines.forEach(drawLine);
}

function drawName(context, name="", x, y) {
    context.font = "20px Arial";
    context.fillText(name, x, y);
}

function Face({id}){

    useFirebaseConnect([
        `face/${id}`,
        `users/${id}/name`
    ]);

    const canvasRef = React.useRef();

    const face = useSelector(state => id && state.firebase.data.face && state.firebase.data.face[id]);
    const name = useSelector(state => id && state.firebase.data.users && state.firebase.data.users[id] && state.firebase.data.users[id].name);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (face && canvas) {
            const lines = getLines(face);
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawLines(context, lines);
            // if (face.box) drawName(context, name.split(" ")[0], face.box.x, face.box.y);
        }
    }, [face]);

    return <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
    <canvas ref={canvasRef} height="200" width="200" style={{height:200,weight:200}} />
<Typography>{name && name.split(" ")[0]}</Typography>
    </div>
}

export default Face;