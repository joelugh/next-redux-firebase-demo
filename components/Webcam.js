import React from 'react';
import { useSelector } from 'react-redux';

import { isFaceDetectionModelLoaded, getFaceDetectorOptions, getCurrentFaceDetectionNet } from '../utils/faceDetectionControls';

import { getDB } from '../_firebase';

// import * as faceapi from 'face-api.js';

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (global.navigator) {

    if(navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
        }
    }

}



function Webcam (props){

    const videoRef = React.useRef();

    const user = useSelector(state => state.firebase.profile);

    const userRef = getDB().ref(`face/${user.id}`);

    async function updateResults() {

        try {
            if (!isFaceDetectionModelLoaded()) {
                console.log(await getCurrentFaceDetectionNet());
                await getCurrentFaceDetectionNet().load('/')
            }

            const inputImgEl = videoRef.current;
            const options = getFaceDetectorOptions()

            const results = await faceapi.detectSingleFace(inputImgEl, options).withFaceLandmarks();
            if (results && inputImgEl) {
                const resizedResults = faceapi.resizeResults(results, inputImgEl);
                const dims = resizedResults.detection._imageDims;
                const {_x, _y, _width, _height} = resizedResults.detection._box;
                const box = {x: dims._width - _x, y:_y, width:_width, height:_height};
                const x = [];
                const y = [];
                resizedResults.landmarks._positions.forEach(p => {
                    x.push(dims._width - p.x); // flip horizontal
                    y.push(p.y);
                });
                userRef.update({x, y, box});
            }
        } catch (err) {
            console.log(err);
        }
        setTimeout(updateResults,20);
      }

    async function run() {
        // load face detection and face landmark models
        try {
            await faceapi.loadFaceLandmarkModel('/');
            console.log('loaded');
        } catch(err) {
            console.log(err);
        }

        // start processing image
        updateResults()
    }

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
            const video = videoRef.current;
            if (video && "srcObject" in video) {
                video.srcObject = stream;
            } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
            }
            video.onloadedmetadata = function(e) {
                video.play();
                run();
            };
        })
        .catch((err) => { console.log(err) });
    }, []);

    return <div>
        <video ref={videoRef} autoPlay={true} width="224" height="224" style={{display: 'none'}}/>
    </div>;
};

export default Webcam;