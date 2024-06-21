import * as cv from '@techstark/opencv-js'

const FrontConstants = {
    'Normal':{'yaw': 0, 'pitch': 150, 'roll': 0,},
    'Right':{'yaw': 20, 'pitch': 30, 'roll': -25,},
    'Left':{'yaw': -15, 'pitch': -30, 'roll': 25,}
}
const MiddleConstants = {
    'Normal':{'yaw': -7, 'pitch': 150, 'roll': 0,},
    'Right':{'yaw': 10, 'pitch': 30, 'roll': -25,},
    'Left':{'yaw': -20, 'pitch': -30, 'roll': 25,}
}
let rollValue = null
let pitchValue = null
let YawValue = null

let startTime = null
let rollvaluechange = null
let pitchvaluechange = null
let yawvaluechange = null
let pos = null

export function onResults(face, width, height, ctx, detectstatus) {
    console.log('middle')

    ctx.fillStyle = 'blue'

    ctx.fill();

    var face_2d = [];
  
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj      
    // https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
    
    var points = [1, 33, 263, 61, 291, 199];
    /*
    var pointsObj = [ 0.0,
        -3.406404,
        5.979507,
        -2.266659,
        -7.425768,
        4.389812,
        2.266659,
        -7.425768,
        4.389812,
        -0.729766,
        -1.593712,
        5.833208,
        0.729766,
        -1.593712,
        5.833208,
        //0.000000, 1.728369, 6.316750];
        -1.246815,
        0.230297,
        5.681036];
  */  
    var pointsObj = [ 0,	-1.126865,	7.475604, // nose 1
       -4.445859,	2.663991,	3.173422, //left eye corner 33
        4.445859,	2.663991,	3.173422, //right eye corner 263
        -2.456206,	-4.342621,	4.283884,// left mouth corner 61
        2.456206,	-4.342621,	4.283884,// right mouth corner 291
        0,	-9.403378,	4.264492];//chin
  
  
  
    var width = width; //canvasElement.width; //
    var height = height; //canvasElement.height; //results.image.height;
    var roll = 0,
      pitch = 0,
      yaw = 0;
    var x, y, z;
  
    // Camera internals
    var normalizedFocaleY = 1.28; // Logitech 922
    var focalLength = height * normalizedFocaleY;
    var s = 0;//0.953571;
    var cx = width / 2;
    var cy = height / 2;
  
    var cam_matrix = cv.matFromArray(3, 3, cv.CV_64FC1, [
      focalLength,
      s,
      cx,
      0,
      focalLength,
      cy,
      0,
      0,
      1
    ]);
  
    //The distortion parameters
    //var dist_matrix = cv.Mat.zeros(4, 1, cv.CV_64FC1); // Assuming no lens distortion
    var k1 = 0.1318020374;
    var k2 = -0.1550007612;
    var p1 = -0.0071350401;
    var p2 = -0.0096747708;
    var dist_matrix = cv.matFromArray(4, 1, cv.CV_64FC1, [k1, k2, p1, p2]);
    var message = "";
  
    if (face) {
      for (const landmarks of face.faceLandmarks) {
  
        for (const point of points) {
          var point0 = landmarks[point];
          
          //console.log("landmarks : " + landmarks.landmark.data64F);
    
          var x = point0.x * width;
          var y = point0.y * height;
          //var z = point0.z; 
  
          // Get the 2D Coordinates
          face_2d.push(x);
          face_2d.push(y);
        }
      }
    }
  
    if (face_2d.length > 0) {
      // Initial guess
      //Rotation in axis-angle form
      var rvec = new cv.Mat();// = cv.matFromArray(1, 3, cv.CV_64FC1, [0, 0, 0]); //new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1); // Output rotation vector
      var tvec = new cv.Mat();// = cv.matFromArray(1, 3, cv.CV_64FC1, [-100, 100, 1000]); //new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1); // Output translation vector
  
      const numRows = points.length;
      const imagePoints = cv.matFromArray(numRows, 2, cv.CV_64FC1, face_2d);
  
      var modelPointsObj = cv.matFromArray(6, 3, cv.CV_64FC1, pointsObj);
  
      //console.log("modelPointsObj : " + modelPointsObj.data64F);
      //console.log("imagePoints : " + imagePoints.data64F);
  
      
      // https://docs.opencv.org/4.6.0/d9/d0c/group__calib3d.html#ga549c2075fac14829ff4a58bc931c033d
      // https://docs.opencv.org/4.6.0/d5/d1f/calib3d_solvePnP.html
      var success = cv.solvePnP(
        modelPointsObj, //modelPoints,
        imagePoints,
        cam_matrix,
        dist_matrix,
        rvec, // Output rotation vector
        tvec,
        false, //  uses the provided rvec and tvec values as initial approximations
        cv.SOLVEPNP_ITERATIVE//SOLVEPNP_EPNP //SOLVEPNP_ITERATIVE (default but pose seems unstable)
      );
  
      if (success) {
        var rmat = cv.Mat.zeros(3, 3, cv.CV_64FC1);
        const jaco = new cv.Mat();
        
  
        // Get rotational matrix rmat
        cv.Rodrigues(rvec, rmat, jaco); // jacobian	Optional output Jacobian matrix
  
        var sy = Math.sqrt(
          rmat.data64F[0] * rmat.data64F[0] + rmat.data64F[3] * rmat.data64F[3]
        );
  
        var singular = sy < 1e-6;
  
        // we need decomposeProjectionMatrix
  
        if (!singular) {
          //console.log("!singular");
          x = Math.atan2(rmat.data64F[7], rmat.data64F[8]);
          y = Math.atan2(-rmat.data64F[6], sy);
          z = Math.atan2(rmat.data64F[3], rmat.data64F[0]);
        } else {
          console.log("singular");
        //   x = Math.atan2(-rmat.data64F[5], rmat.data64F[4]);
          x = Math.atan2(rmat.data64F[1], rmat.data64F[2]);
          y = Math.atan2(-rmat.data64F[6], sy);
          z = 0;
        }
  
        roll = z;
        pitch = x;
        yaw = y;
  
        var worldPoints = cv.matFromArray(9, 3, cv.CV_64FC1, [
          modelPointsObj.data64F[0] + 3,
          modelPointsObj.data64F[1],
          modelPointsObj.data64F[2], // x axis
          modelPointsObj.data64F[0],
          modelPointsObj.data64F[1] + 3,
          modelPointsObj.data64F[2], // y axis
          modelPointsObj.data64F[0],
          modelPointsObj.data64F[1],
          modelPointsObj.data64F[2] - 3, // z axis
          modelPointsObj.data64F[0],
          modelPointsObj.data64F[1],
          modelPointsObj.data64F[2], //
          modelPointsObj.data64F[3],
          modelPointsObj.data64F[4],
          modelPointsObj.data64F[5], //
          modelPointsObj.data64F[6],
          modelPointsObj.data64F[7],
          modelPointsObj.data64F[8], //
          modelPointsObj.data64F[9],
          modelPointsObj.data64F[10],
          modelPointsObj.data64F[11], //
          modelPointsObj.data64F[12],
          modelPointsObj.data64F[13],
          modelPointsObj.data64F[14], //
          modelPointsObj.data64F[15],
          modelPointsObj.data64F[16],
          modelPointsObj.data64F[17] //
        ]);
  
        //console.log("worldPoints : " + worldPoints.data64F);
  
        var imagePointsProjected = new cv.Mat(
          { width: 9, height: 2 },
          cv.CV_64FC1
        );
        cv.projectPoints(
          worldPoints, // TODO object points that never change !
          rvec,
          tvec,
          cam_matrix,
          dist_matrix,
          imagePointsProjected,
          jaco
        );
  
          
   
        // https://developer.mozilla.org/en-US/docs/Web/CSS/named-color

  
        jaco.delete();
        imagePointsProjected.delete();
    }

    let pitchangle = (180.0 * (pitch / Math.PI))

    if(pitchangle < 0){
        pitchangle = (pitchangle + 180)*-1
    }else{
        pitchangle = (180 - pitchangle)
    }

    // ctx.font = "20px Arial";
    // ctx.fillText("roll: " + (180.0 * (roll / Math.PI)).toFixed(2), 50, 100);
    // ctx.fillText("pitch: " + pitchangle.toFixed(2), 50, 140);
    // ctx.fillText( "yaw: " + (180.0 * (yaw / Math.PI)).toFixed(2), 50, 170);

        let rollAngle = (180.0 * (roll / Math.PI)).toFixed(2)
        let pitchAngle = pitchangle.toFixed(2)
        let yawnAngle = (180.0 * (yaw / Math.PI)).toFixed(2)

        rvec.delete();
        tvec.delete();

        //head pose estimation
        if ( detectstatus === 'middle'){
            console.log('middle')
            pos = MiddleHeadPoseEstimation(rollAngle, yawnAngle, pitchAngle)
            console.log(pos)           
        }else{
            pos = FrontHeadPoseEstimation(rollAngle, yawnAngle, pitchAngle)
        }
 
    }

    return pos
  
  }


const FrontHeadPoseEstimation =(roll, yawn, pitch)=>{

    //analyze roll
    if(roll > FrontConstants.Left.roll && rollvaluechange !== 'left'){
        startTime = Date.now()
        rollValue = 'left'
        rollvaluechange = 'left'
    }else if(roll < FrontConstants.Right.roll && rollvaluechange !== 'right'){
        startTime = Date.now()
        rollValue = 'right'
        rollvaluechange = 'right'
    }else if(roll >= FrontConstants.Right.roll && roll <= FrontConstants.Left.roll && rollvaluechange!== null){
        rollValue = null
        rollvaluechange = null
        startTime = null
    }

    //analyze pitch
    if(pitch <= FrontConstants.Left.pitch && pitchvaluechange !== 'down'){
        startTime = Date.now()
        pitchValue = 'down'
        pitchvaluechange = 'down'
    }else if(pitch >= FrontConstants.Right.pitch && pitchvaluechange !== 'up'){
        startTime = Date.now()
        pitchValue = 'up'
        pitchvaluechange = 'up'
    }else if(pitch > FrontConstants.Left.pitch && pitch < FrontConstants.Right.pitch && pitchvaluechange !== null){
        pitchValue = null
        pitchvaluechange = null
        startTime = null
    }

    //analyze yawn
    if(yawn <= FrontConstants.Left.yaw && yawvaluechange !== 'left'){
        startTime = Date.now()
        YawValue = 'left'
        yawvaluechange = 'left'
    }else if(yawn >= FrontConstants.Right.yaw && yawvaluechange !== 'right'){
        startTime = Date.now()
        YawValue = 'right'
        yawvaluechange = 'right'
    }else if(yawn > FrontConstants.Left.yaw && yawn < FrontConstants.Right.yaw && yawvaluechange !== null){
        YawValue = null
        yawvaluechange = null
        startTime = null
    }

    return {'roll':rollValue, 'pitch':pitchValue, 'yaw':YawValue, 'time': startTime}
}


//middle head posture parameters
const MiddleHeadPoseEstimation =(roll, yawn, pitch)=>{

    //analyze roll
    if(roll > MiddleConstants.Left.roll && rollvaluechange !== 'left'){
        rollValue = 'left'
        rollvaluechange = 'left'
        startTime = Date.now()
    }else if(roll < MiddleConstants.Right.roll && rollvaluechange !== 'right'){
        rollValue = 'right'
        rollvaluechange = 'right'
        startTime = Date.now()
    }else{
        rollValue = null
        rollvaluechange = null
        startTime = null
    }

    //analyze pitch
    if(pitch <= MiddleConstants.Left.pitch && pitchvaluechange !== 'down'){
        pitchValue = 'down'
        pitchvaluechange = 'down'
        startTime = Date.now()
    }else if(pitch <= MiddleConstants.Right.pitch && pitchvaluechange !== 'up'){
        pitchValue = 'up'
        pitchvaluechange = 'up'
        startTime = Date.now()
    }else{
        pitchValue = null
        pitchvaluechange = null
        startTime = null
    }

    //analyze yawn
    if(yawn <= MiddleConstants.Left.yaw && yawvaluechange !== 'left'){
        YawValue = 'left'
        yawvaluechange = 'left'
        startTime = Date.now()
    }else if(yawn >= MiddleConstants.Right.yaw && yawvaluechange !== 'right'){
        YawValue = 'right'
        yawvaluechange = 'right'
        startTime = Date.now()
    }else{
        YawValue = null
        yawvaluechange = null
        startTime = null
    }
    console.log('roll ',rollValue, 'pitch ',pitchValue, 'yaw ',YawValue)

    return {'roll':rollValue, 'pitch':pitchValue, 'yaw':YawValue, 'time': startTime}
}


let calling = false
let iscalling = null
let calltime  = null

// hand pose
export const HandPose = (landmarks)=>{
    if(landmarks && landmarks.length === 33 && landmarks[11]!==undefined && landmarks[21]!==undefined  && landmarks[12]!==undefined  && landmarks[22]!==undefined  ){
        let ThumbY = landmarks[21].y
        let shoulderY = landmarks[11].y

    
        let shoulder2Y = landmarks[12].y
        let Thumb2Y = landmarks[22].y
    
        if(( Thumb2Y < shoulder2Y) && iscalling !== 'calling'){
            iscalling = 'calling'
            calltime = Date.now()
            calling = true
        }else if((Thumb2Y > shoulder2Y) && iscalling !== 'down'){
            iscalling = 'down'
            calltime = null
            calling = false
        }
    
    }
    
    return {calling, calltime}
}