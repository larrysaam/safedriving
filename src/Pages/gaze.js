import * as THREE from 'three';
import { IrisEyeOval } from './utilities';

const IRIS_LANDMARK_INDICES = [468, 469, 470, 471]; // Eyelid landmarks
const lefteyeside = 362
const righteyeside = 263

let gazeDirection = {}

export const gazeTrack=(ctx, x,y, landmarkspoints)=>{
    if (landmarkspoints.length > 0) {    

        let value = Looking(landmarkspoints)
        IrisEyeOval (ctx, 90, 70, (90+(2*value)), 70, x, y)
        IrisEyeOval (ctx, 210, 70, (210+(2*value)), 70, x, y)

    }
}

   


// const calculateIrisCenter = (landmarks, irisLandmarkIndices) => {
//   let centerX = 0;
//   let centerY = 0;
//   for (let i = 0; i < irisLandmarkIndices.length; i++) {
//     const landmark = landmarks[irisLandmarkIndices[i]];
//     centerX += landmark.x;
//     centerY += landmark.y;
//   }
//   return { x: centerX / irisLandmarkIndices.length, y: centerY / irisLandmarkIndices.length };
// };





const RIGHT_EYE_LANDMARK_INDICES = [33, 243, 133, 153, 144, 163, 7]; // Right eye landmark indices (adjust based on documentation)
const IRIS_LANDMARK_INDICE = [ 469, 470, 471, 472]; // Eyelid landmarks

const gazeThreshold = 0.1; // Adjust threshold for accuracy

function isLookingLeft(landmarks) {
  const rightEyeCenter = calculateCenter(landmarks, RIGHT_EYE_LANDMARK_INDICES);
  const irisCenter = calculateIrisCenter(landmarks, IRIS_LANDMARK_INDICE);

  // Calculate gaze direction based on difference between iris center and right eye center
  const gazeX = irisCenter.x - rightEyeCenter.x;
//   console.log("gaze : "+(gazeX*10000))

    return (gazeX*1000)
}

function calculateCenter(landmarks, landmarkIndices) {
  let centerX = 0;
  let centerY = 0;
  for (let i = 0; i < landmarkIndices.length; i++) {
    const landmark = landmarks[landmarkIndices[i]];
    centerX += landmark.x;
    centerY += landmark.y;
  }
  return { x: centerX / landmarkIndices.length, y: centerY / landmarkIndices.length };
}

function calculateIrisCenter(landmarks, irisLandmarkIndices) {
  return calculateCenter(landmarks, irisLandmarkIndices);
}



export const Looking = (landmarks)=>{
    const isLeftGaze = isLookingLeft(landmarks);

      return isLeftGaze
}
