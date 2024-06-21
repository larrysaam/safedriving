
import './index.css'

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

import { ImSleepy } from "react-icons/im";
import { GoAlertFill } from "react-icons/go";
import { IoIosPhonePortrait } from "react-icons/io";
import { GiNightSleep } from "react-icons/gi";

import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/facemesh'
import { runDetector } from "../Utils/detector";
import logo from './R.png'

// NEW MODEL

// Adds the CPU backend to the global backend registry.
import '@tensorflow/tfjs-backend-cpu';

import { drawMesh } from '../Utils/util';
import { DrawingUtils, FilesetResolver, FaceLandmarker, PoseLandmarker, ObjectDetector } from '@mediapipe/tasks-vision';
import {FaceMesh, drawCircles, objectBox} from './utilities'
import {HandPose, onResults } from './headpose';
import { AngleNoseSholder } from './bodyPose';
import LoadingPage from './Loading';
import {CarDashboard} from './CarDashboard'
import { Stats } from './Statistics';

import alarm1 from './voice alert/alert bip2.mp3'
import sleepy from './voice alert/sleepy.mp3'
import distracted2 from './voice alert/distracted2.mp3'
import end from './voice alert/end.mp3'
import yawning from './voice alert/yawning.mp3'
import onphone from './voice alert/calling.mp3'




const Home = ()=>{
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const canvas1Ref = useRef(null);
    const canvas2Ref = useRef(null);

    const [detectstatus, setDetect] = useState(null)

    const [playing, setPlaying] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('Normal Driving')
    const [closed, setClosed] = useState(false)
    const [closeEyeStartTime, setCloseEyeStartTime] = useState(null);
    const [openMouth, setOpenMouth] = useState(false)
    const [openMouthStartTime, setOpenMouthStartTime] = useState(null);
    const [obj, setObj] = useState(null)
    const [objStartTime, setObjStartTime] = useState(null);
    const [callin, setCallin] = useState(false)
    const [callinStartTime, setCallinStartTime] = useState(null);

    const [startTripTime, setStartTripTime] = useState(0);
    const [phonetime, setPhonetime] = useState(0);
    const [droswsytime, setDroswsytime] = useState(0);
    const [distracttime, setDistracttime] = useState(0);


    const [yaw, setYaw] = useState('null')
    const [pitch, setPitch] = useState('')
    const [roll, setRoll] = useState('')

    const [headPostureStartTime, setHeadPostureStartTime] = useState(null);

    const closeEyeDuration = 5000; // Time in milliseconds (5 seconds)
    const openMouthDuration = 3000; // Time in milliseconds (5 seconds)
    

    //object detection
    const ObjectDetection=async()=>{
      const vision = await FilesetResolver.forVisionTasks(
        // path/to/wasm/root
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
        },
        scoreThreshold: 0.7,
        runningMode: "video"
      });

      return objectDetector
    }

    //pose landmamrk 
    const runPoseMesh = async()=>{
      const vision = await FilesetResolver.forVisionTasks(
        // path/to/wasm/root
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const poseLandmark = await PoseLandmarker.createFromOptions(
          vision, 
          {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            },
            runningMode: "video"
          });

          setInterval(() => {
            detect(poseLandmark)
          }, 200);
    }

  //Run face landmark
    const runFaceMesh = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      //face landmark and detection
      const faceLandmarker = await FaceLandmarker.createFromOptions(
        vision, {
            baseOptions: { modelAssetPath:  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task" },
            runningMode: "video"
        }
    );


    //object detection model
    const objectDetector = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
      },
      scoreThreshold: 0.4,
      runningMode: "video"
    });

    //pose landmark
    const poseLandmark = await PoseLandmarker.createFromOptions(
      vision, 
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        },
        runningMode: "video"
      });


      setInterval(() => {
        detect(faceLandmarker, objectDetector, poseLandmark)
      }, 200);
    };


    //pose drawer
    const drawPoseLandmark = (result, ctx)=>{
      const drawingUtils = new DrawingUtils(ctx);

      for (const landmark of result.landmarks) {
        drawingUtils.drawLandmarks(landmark, {
          radius: (data) => DrawingUtils.lerp(data.z, -0.15, 0.1, 5, 1)
        });
        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
      }
    }


    const AlertDriver =(alertType)=>{
      let audioalert = new Audio(alarm1)
      let audioend = new Audio(end)
      
      console.log(alertType)
      if(!playing){
        setPlaying(true)
        setPlaying(true)

        if(alertType === 1){
          setPlaying(true)
          let audio = new Audio(sleepy)          
          audio.play()
  
          audio.addEventListener('ended', () => {
            audioalert.play()
            audioalert.addEventListener('ended', () => {
              setMessage('Normal Driving')
              setPlaying(false)
            })
          })
        }else if(alertType >=2 && alertType <7){
          setPlaying(true)
          let audio = new Audio(distracted2)
          audio.play()
  
          audio.addEventListener('ended', () => {
            audioalert.play()
            audioalert.addEventListener('ended', () => {
              setMessage('Normal Driving')
              setPlaying(false)
            })
          })
        }else if(alertType === 8){
          setPlaying(true)
          let audio = new Audio(yawning)
          audio.play()

          audio.addEventListener('ended', () => {
            audioend.play()
            audioend.addEventListener('ended', () => {
              setMessage('Normal Driving')
              setPlaying(false)
            })
          })
        }else if(alertType === 9){
          setPlaying(true)
          let audio = new Audio(onphone)
          audio.play()

          audio.addEventListener('ended', () => {
            audioalert.play()
            audioalert.addEventListener('ended', () => {
              setMessage('Normal Driving')
              setPlaying(false)
            })
          })
        }
    }
    }



  
    const detect = async (detector, objectDetector, poseLandmark) => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = window.screen.width-10;
        const videoHeight = window.screen.height-10;

        const cw = webcamRef.current.video.videoWidth
        const ch = webcamRef.current.video.videoHeight


        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
  
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        const face = detector.detectForVideo(video, performance.now());
        const object = objectDetector.detectForVideo(video, performance.now());
        const pose = poseLandmark.detectForVideo(video, performance.now());

        const ctx = canvasRef.current.getContext("2d");
        const ctx1 = canvas1Ref.current.getContext("2d");
        const ctx2 = canvas2Ref.current.getContext("2d");
        

        const canvas = canvasRef.current;
        const canvas1 = canvas1Ref.current;
        const canvas2 = canvas2Ref.current;
 

        if(detectstatus === 'endTrip'){

        }else{
          if(face.faceLandmarkers || pose.landmarks){
            setLoading(false)
            requestAnimationFrame(() => {
            
              // blink detection
              let  blinked = FaceMesh(face, ctx, ctx1, ctx2, canvas, canvas1, cw, ch)
              setClosed(blinked.closed)
              setCloseEyeStartTime(blinked.time);
              setOpenMouth(blinked.yawn)
              setOpenMouthStartTime(blinked.mouthtime)
  
              // detcet head movement
              let posture = onResults(face, videoWidth, videoWidth, ctx, detectstatus)
             
                console.log(posture.yaw)
                setYaw(posture.yaw)
                setPitch(posture.pitch)
                setRoll(posture.roll)
                setHeadPostureStartTime(posture.time)
            
              
              //pose estimation (detect hand beside ear)
              // drawPoseLandmark(pose, ctx)
              let {calling, calltime} = HandPose(pose.landmarks[0])
              console.log(callin, calling)
        
              setCallin(calling)
              setCallinStartTime(calltime)
              
              
    
              // object detection
              let {obj, ObjectTime} = objectBox(ctx, canvas, object)
              setObj(obj)
              setObjStartTime(ObjectTime)
            });
            
          }else{
            setLoading(true)
          }
          // if(face.faceLandmarks > 0 && loading === true){
          //   setLoading(false)
          // }
        }

        


      }
    };


    useEffect(()=>{
      setStartTripTime(Date.now())
      runFaceMesh();    
    },[])



    //handles eye closure
    useEffect(()=>{
      if(closed === true){
        setMessage('Driver is Drowsy!')
      }else{
        setMessage('Normal Driving')
      }
      let timeoutId = setTimeout(() => {
        if (closed && (closeEyeDuration !== null) && (Date.now() - closeEyeStartTime) >= 2000) {
          setDroswsytime(droswsytime + 3)
          setMessage('Driver is Sleeping!')
          AlertDriver(1);  // Call your function to play the audio
          setClosed(false);
          setCloseEyeStartTime(null); // Reset start time after playing audio
        }
      }, 2000);
        
      
      return () => clearTimeout(timeoutId)
    },[closed, closeEyeStartTime])


    //handles hand beside ear
    useEffect(()=>{
      console.log('CALING TIME ',callinStartTime)
      if(callin){
        setMessage('Driver Calling!')
      }else{
        setMessage('Normal Driving')
      }
      
      let timeoutId = setTimeout(() => {
        if (callin && (callinStartTime !== null) && (Date.now() - callinStartTime) >= 5000) {
          setPhonetime(phonetime + 5)
          AlertDriver(9)
          setCallin(false);
          setCallinStartTime(null); // Reset start time after playing audio
        }
      }, 5000);
        
      
      return () => clearTimeout(timeoutId)
    },[callin])


    //handles mouth yawning
    useEffect(()=>{
      if(openMouth){
        setMessage('Driver is yawning!')
      }else{
        setMessage('Normal Driving')
      }
      
      let timeoutId = setTimeout(() => {
        if (openMouth && (openMouthDuration !== null) && (Date.now() - openMouthStartTime) >= openMouthDuration) {
          setDroswsytime(droswsytime + 3)
          AlertDriver(8); // Call your function to play the audio
          setOpenMouth(false);
          setOpenMouthStartTime(null); // Reset start time after playing audio
        }
      }, 3000);        
      
      return () => clearTimeout(timeoutId)
    },[openMouth, openMouthStartTime])



    //handles object detection
    useEffect(()=>{
      console.log(obj, objStartTime)
      if(obj !== null){
        setMessage('Driver on Phone!')
      }else{
        setMessage('Normal Driving')
      }
      let timeoutId = setTimeout(() => {
        if ((obj !== null) && (objStartTime !== null) && (Date.now() - objStartTime) >= 3000) {
          setPhonetime(phonetime + 3)
          AlertDriver(9)
          setObj(null);
          setObjStartTime(null); // Reset start time after playing audio
        }
      }, 3000);        
      
      return () => clearTimeout(timeoutId)
    },[obj, objStartTime])



    //handle head posture change
    useEffect(()=>{
      
      if(headPostureStartTime !== null){
        setMessage('Driver is Distracted!')
      }else{
        setMessage('Normal Driving')
      }
      let timeoutId = setTimeout(() => {
        if((Date.now() - headPostureStartTime) >= 3000){
          setDistracttime(distracttime + 3)
          console.log('inside posture')
          if(pitch === 'down'){
            AlertDriver(2)
            setHeadPostureStartTime(null);
          }else if(yaw === 'left'){
            AlertDriver(3)
            setHeadPostureStartTime(null)
          }else if(yaw === 'right'){
            AlertDriver(4)
            setHeadPostureStartTime(null)
          }else if(roll === 'left' || roll === 'right'){
            AlertDriver(6)
            setHeadPostureStartTime(null)
          }
        }
      }, 3000);

      return () => clearTimeout(timeoutId)

    },[yaw, pitch, roll])



    return (
        <div className="camera_div">
          {
            detectstatus === null?
              <CarDashboard setDetect={setDetect}/>
              :
              detectstatus === 'endTrip'?
                <Stats startTripTime={startTripTime} phonetime={phonetime} droswsytime={droswsytime} distracttime={distracttime}/>
              :
                  <>
                    <div className='main_top_box'>
                    <div className='top_alert_box'>
                          {(message !== '')? 
                              
                            <>
                                {
                               ( message === 'Driver is yawning!')?
                                <ImSleepy className='alerticons'/>:
                                (message === 'Driver is Drowsy!')?
                                <ImSleepy className='alerticons'/>:
                                (message === 'Driver is Sleeping!' )?
                                <GiNightSleep className='alerticons'/>:
                                (message === 'Driver is Distracted!')?
                                <GoAlertFill className='alerticon'/>:
                                (message === 'Driver on Phone!' || message ==='Driver Calling!')?
                                <IoIosPhonePortrait className='alerticons'/>:
                                ''
                              }
                                <h3 className='message_box'>{message}</h3>
                            </>
                            : ''
                        }
                    </div>
                    </div>
                  
                    <Webcam
                        ref={webcamRef}
                        id='webcam'
                    />
                    <canvas
                        ref={canvasRef}
                        id='canvas'
                    />
    
                    {/* Bottom Info Box*/}
                      <div className='bottom_info_box'>
                        <div className='side_bottom1'>
                          <canvas id='eyeCanvas' ref={canvas1Ref}/>
                          <h4>EyeLid Status</h4>
                          <canvas id='eyeGazeCanvas' ref={canvas2Ref}/>
                          <h4>Gaze Status</h4>
                        </div>
                        <div className='side_bottom2'></div>
                        {/* <div className='side_bottom3'>
                          <canvas id='HeadPose' ref={canvas3Ref}/>
                        <h4>Head Pose</h4>
                        </div> */}
                      </div>
                      <button className='endtripbtn' onClick={()=>{setDetect('endTrip')}}>End Trip</button>
                      <LoadingPage loading={loading}/>
                  </>

          }
        </div>
    );
}

export default Home

