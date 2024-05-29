
import './index.css'

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/facemesh'
import { runDetector } from "../Utils/detector";

// NEW MODEL

// Adds the CPU backend to the global backend registry.
import '@tensorflow/tfjs-backend-cpu';

import { drawMesh } from '../Utils/util';
import { startPrediciton } from './blinkpredict';
import { DrawingUtils, FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import {FaceMesh} from './utilities'


const inputResolution = {
    width: 1080,
    height: 900,
  };
  
  const videoConstraints = {
    width: inputResolution.width,
    height: inputResolution.height,
    facingMode: "user",
  };


// const Home = ()=>{
//     const webcamRef = useRef(null);
//     const canvasRef = useRef(null);
  
//     const runFaceMesh = async () => {
//       const net =  await facemesh.load({
//         inputResolution: { width:640, height:480 }, scale:0.8
//       })

//       setInterval(() => {
//         detect(net)
//       }, 100);
//     };
  
//     const detect = async (detector) => {
//       if (
//         typeof webcamRef.current !== "undefined" &&
//         webcamRef.current !== null &&
//         webcamRef.current.video.readyState === 4
//       ) {
//         const video = webcamRef.current.video;
//         const videoWidth = webcamRef.current.video.videoWidth;
//         const videoHeight = webcamRef.current.video.videoHeight;
  
//         webcamRef.current.video.width = videoWidth;
//         webcamRef.current.video.height = videoHeight;
  
//         canvasRef.current.width = videoWidth;
//         canvasRef.current.height = videoHeight;
  
//         const face = await detector.estimateFaces(video);

       
//         //draw mesh
//         const ctx = canvasRef.current.getContext("2d");
//         requestAnimationFrame(() => {
//           startPrediciton(face, ctx)
//           drawMesh(face, ctx);
//         });

//         // const leftEye = mesh.slice(/* Left eye landmark indices */, /* Last index */);
//         // const rightEye = mesh.slice(/* Right eye landmark indices */, /* Last index */);

//       }
//     };
  



//     runFaceMesh();    

//     return (
//         <div className="camera_div">
//             <Webcam
//                 ref={webcamRef}
//                 width={inputResolution.width}
//                 height={inputResolution.height}
//                 id='webcam'
//             />
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     position: "absolute",
//                     marginLeft: "auto",
//                     marginRight: "auto",
//                     left: 0,
//                     right: 0,
//                     textAlign: "center",
//                     zIndex: 9,
//                     width: 640,
//                     height: 480,
//                 }}
//             />
//         </div>
//     );
// }

// export default Home



const Home = ()=>{
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
  
    const runFaceMesh = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      const faceLandmarker = await FaceLandmarker.createFromOptions(
        vision, {
            baseOptions: { modelAssetPath:  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task" },
            runningMode: "video"
        }
    );

      setInterval(() => {
        detect(faceLandmarker)
      }, 200);
    };
  
    const detect = async (detector) => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
  
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
  
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        const face = detector.detectForVideo(video, performance.now());
        console.log(face)

        const ctx = canvasRef.current.getContext("2d");
        const canvas = canvasRef.current;
        requestAnimationFrame(() => {
          FaceMesh(face, ctx, canvas)
        });



      
          

       
        //draw mesh
        // const ctx = canvasRef.current.getContext("2d");
        // requestAnimationFrame(() => {
        //   drawMesh(face, ctx);
        // });

        // const leftEye = mesh.slice(/* Left eye landmark indices */, /* Last index */);
        // const rightEye = mesh.slice(/* Right eye landmark indices */, /* Last index */);

      }
    };
  



    runFaceMesh();    

    return (
        <div className="camera_div">
            <Webcam
                ref={webcamRef}
                width={inputResolution.width}
                height={inputResolution.height}
                id='webcam'
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: 640,
                    height: 480,
                }}
            />
        </div>
    );
}

export default Home

