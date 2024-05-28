// import './index.css'

// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";

// import { runDetector } from "../Utils/detector";

// // NEW MODEL

// import * as facemesh from "@tensorflow-models/face-landmarks-detection";
// import { startPrediciton } from './blinkpredict';
// // Adds the CPU backend to the global backend registry.
// import '@tensorflow/tfjs-backend-cpu';

// import { drawMesh } from '../Utils/util';

// const inputResolution = {
//     width: 1080,
//     height: 900,
//   };
  
//   const videoConstraints = {
//     width: inputResolution.width,
//     height: inputResolution.height,
//     facingMode: "user",
//   };


// const Home = ()=>{
//     const webcamRef = useRef(null);
//     const canvasRef = useRef(null);
  
//     const runFaceMesh = async () => {
//       const model = facemesh.SupportedModels.MediaPipeFaceMesh;
//       const detectorConfig = {
//         runtime: "tfjs",
//         solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
//       };
//       const detector = await facemesh.createDetector(model, detectorConfig);
//       setInterval(() => {
//         detect(detector);
//       }, 200);
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
  
//         const estimationConfig = { flipHorizontal: false };
//         const faces = await detector.estimateFaces(video, estimationConfig);
//         startPrediciton(faces)

//         //draw mesh
//         const ctx = canvasRef.current.getContext("2d");
//         requestAnimationFrame(() => {
//           drawMesh(faces[0], ctx);
//         });

//         console.log(faces)
//         detect(detector)
//       }
//     };

//     useEffect(()=>{
//       runFaceMesh()
//     },[])
  
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

const inputResolution = {
    width: 1080,
    height: 900,
  };
  
  const videoConstraints = {
    width: inputResolution.width,
    height: inputResolution.height,
    facingMode: "user",
  };


const Home = ()=>{
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
  
    const runFaceMesh = async () => {
      const net =  await facemesh.load({
        inputResolution: { width:640, height:480 }, scale:0.8
      })

      setInterval(() => {
        detect(net)
      }, 90);
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
  
        const face = await detector.estimateFaces(video);

        //draw mesh
        const ctx = canvasRef.current.getContext("2d");
        requestAnimationFrame(() => {
          drawMesh(face, ctx);
        });

        // const leftEye = mesh.slice(/* Left eye landmark indices */, /* Last index */);
        // const rightEye = mesh.slice(/* Right eye landmark indices */, /* Last index */);

        console.log(face)
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




// OBJECT DETECT

// import React, { useRef, useState, useEffect } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as cocossd from "@tensorflow-models/coco-ssd";
// import Webcam from "react-webcam";
// import "./index.css";
// import { drawMesh } from '../Utils/util';

// function Home() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   // Main function
//   const runCoco = async () => {
//     const net = await cocossd.load();
//     console.log("Handpose model loaded.");
//     //  Loop and detect hands
//     setInterval(() => {
//       detect(net);
//     }, 100);
//   };

//   const detect = async (net) => {
//     // Check data is available
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       // Get Video Properties
//       const video = webcamRef.current.video;
//       const videoWidth = webcamRef.current.video.videoWidth;
//       const videoHeight = webcamRef.current.video.videoHeight;

//       // Set video width
//       webcamRef.current.video.width = videoWidth;
//       webcamRef.current.video.height = videoHeight;

//       // Set canvas height and width
//       canvasRef.current.width = videoWidth;
//       canvasRef.current.height = videoHeight;

//       // Make Detections
//       const obj = await net.detect(video);
//     console.log(obj)
//       // Draw mesh
//       const ctx = canvasRef.current.getContext("2d");
//       drawMesh(obj, ctx); 
//     }
//   };

//   useEffect(()=>{runCoco()},[]);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Webcam
//           ref={webcamRef}
//           muted={true} 
//           style={{
//             position: "absolute",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zindex: 9,
//             width: 640,
//             height: 480,
//           }}
//         />

//         <canvas
//           ref={canvasRef}
//           style={{
//             position: "absolute",
//             marginLeft: "auto",
//             marginRight: "auto",
//             left: 0,
//             right: 0,
//             textAlign: "center",
//             zindex: 8,
//             width: 640,
//             height: 480,
//           }}
//         />
//       </header>
//     </div>
//   );
// }

// export default Home;