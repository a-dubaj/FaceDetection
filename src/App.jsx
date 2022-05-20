import './App.css';
import {useEffect, useRef} from "react";
import * as faceapi from 'face-api.js';


function App() {
    const imgRef = useRef();
    const canvasRef = useRef();

    const handleImage = async () => {
        const detection = await faceapi.detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        console.log(detection);
    }
    useEffect(() => {
        const loadModels = () => {
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
                faceapi.nets.faceExpressionNet.loadFromUri("/models"),
            ]).then(handleImage).catch((e) => console.log(e));
        };
        imgRef.current && loadModels();
    }, []);

    return (
        <div className="App">
            <img
                crossOrigin="anonymous"
                ref={imgRef}
                src="https://images.pexels.com/photos/9371782/pexels-photo-9371782.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                alt="" width="940" height="650"/>
            <canvas ref={canvasRef} width="940" height="650"/>
        </div>
    );
}

export default App;
