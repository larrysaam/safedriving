import { gazeTrack } from "./gaze";

// Helper function to calculate Euclidean distance
function euclideanDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  
function eye_aspect_ratio(eye){
    let p2_minus_p6 = euclideanDistance(eye[1][0],eye[1][1], eye[5][0],eye[5][1])
    let p3_minus_p5 = euclideanDistance(eye[2][0],eye[2][1], eye[4][0],eye[4][1])
    let p1_minus_p4 = euclideanDistance(eye[0][0],eye[0][1], eye[3][0],eye[3][1])
    let ear = (p2_minus_p6 * p3_minus_p5) /(2 * p1_minus_p4)
    return ear
}
  
function getEyeCoordinate(righteye, keypoints, canvas){
    let eye = []

    for(let i = 0; i < righteye.length; i++){
        let xd = keypoints[righteye[i]].x  * canvas.width;
        let yd = keypoints[righteye[i]].y  * canvas.height;

        eye.push([xd, yd])

    }

    return eye
}


let obj = null
let detect = null
let ObjectTime = null

export const objectBox = (ctx, canvas, result)=>{

  result.detections.forEach(objects =>{

    if(objects.categories[0].categoryName === 'cell phone'){

      if(detect !== 'cell phone'){
        detect = 'cell phone'
        ObjectTime = Date.now()
        obj = 'cell phone'
      }
      // Draw the square using bounding box properties
      let boundingBox = objects.boundingBox
      ctx.strokeRect(boundingBox.originX, boundingBox.originY, boundingBox.width, boundingBox.height);
      // Optional: Set stroke style and line width (adjust as needed)
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
    }else if (objects.categories[0].categoryName === 'bottle'){

      if(detect !== 'bottle'){
        detect = 'bottle'
        ObjectTime = Date.now()
        obj = 'bottle'
      }

        // Draw the square using bounding box properties
        let boundingBox = objects.boundingBox
        ctx.strokeRect(boundingBox.originX, boundingBox.originY, boundingBox.width, boundingBox.height);
        // Optional: Set stroke style and line width (adjust as needed)
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
    }
  })

  return {obj, ObjectTime}
}


let blinkvalue = false
let mouthvalue = false
const EAR_THRESHOLD = 1.34;
const MOUTH_THRESHOLD = 30
let eye = [362, 385, 387, 263, 373, 380, 33, 160, 158, 133, 153, 144, 78, 82, 312, 308, 317, 87]
let righteye = [362, 385, 387, 263, 373, 380]
let lefteye = [33, 160, 158, 133, 153, 144]
let Mouth = [78, 82, 312, 308, 317, 87]
let leftEAR = 0
let rightEAR = 0
let x
let y
let count = 0
let closed = false
let yawn =  false
let closeEyeStartTime = null
let openMouthStartTime = null
let EAR


export const FaceMesh=(face, ctx, ctx1, ctx2, canvas, canvas1, cw, ch)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas1.width, canvas1.height);
    
    ctx.fillStyle = 'white';
    face.faceLandmarks.forEach(landmarks => {
      
      //468 midpoint left
      //473 midpoint right

    //   if(landmarks.length == 478) {
    //     for(let i = 469; i < 473; i++) {
    //         let x = landmarks[i].x * cw;
    //         let y = landmarks[i].y * ch;

    //         ctx.beginPath();
    //         ctx.fillStyle= "red"
    //         ctx.rect(x, y, 2, 2);
    //         ctx.stroke();
            
    //     }
    // }
        

      //calculating left Eye aspect ratio
      let EyeCoordinate = getEyeCoordinate(lefteye, landmarks, canvas)
      leftEAR =  eye_aspect_ratio(EyeCoordinate)
      //calculating right Eye aspect ratio
      EyeCoordinate = getEyeCoordinate(righteye, landmarks, canvas)
      rightEAR =  eye_aspect_ratio(EyeCoordinate)


      // iris track
      gazeTrack(ctx2, 50, (10 * (leftEAR)), landmarks)

      //drawing oval of eyes
      EyeOval(ctx1, 90, 70, 50, (10 * (leftEAR)) )
      EyeOval(ctx1, 210, 70, 50, (10 * (rightEAR)))


      ctx.fillText(" Blinked : "+ count, 10, 80);
      ctx.font = "20px Arial";

      // True if the eye is closed
      let blinked = (leftEAR <= EAR_THRESHOLD) || (rightEAR <= EAR_THRESHOLD);
      // Determine how long you blinked
      if (blinked===true && blinkvalue === false) {
          count = count +1

          closed = true
          blinkvalue = true
          closeEyeStartTime = Date.now()
      } else if (!blinked && blinkvalue) {
          blinkvalue = false
          closed = false
      }


      //calculate Mouth aspect ratio
      let MouthCoordinate = getEyeCoordinate(Mouth, landmarks, canvas)
      let MouthEAR =  eye_aspect_ratio(MouthCoordinate)

      // True if the mouth is widely open
      let MouthOpen = MouthEAR >= MOUTH_THRESHOLD;
      
      if (MouthOpen===true && mouthvalue === false) {
          yawn = true
          mouthvalue = true
          openMouthStartTime = Date.now()
      } else if (!MouthOpen && mouthvalue) {
          mouthvalue = false
          yawn = false
      }

  });

    // return {closed, leftEAR, yawn, roll, pitch}
    return {'closed':closed, 'time':closeEyeStartTime, 'yawn': yawn, 'mouthtime': openMouthStartTime}
}



const distanceBetweenPoints = (point1, point2) => {
  // Calculate the Euclidean distance between two points
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
};




  
function calculateDirection(ctx, keyPoints) {
    let noseTip, leftNose, rightNose;
    try {
      noseTip = { ...keyPoints[1], name: "nose tip" };
      leftNose = { ...keyPoints[279], name: "left nose" };
      rightNose = { ...keyPoints[49], name: "right nose" };
    } catch (error) {
      console.log("error creating directional points", keyPoints, error);
    }
  
    // MIDESCTION OF NOSE IS BACK OF NOSE PERPENDICULAR
    const midpoint = {
      x: (leftNose.x + rightNose.x) / 2,
      y: (leftNose.y + rightNose.y) / 2,
      z: (leftNose.z + rightNose.z) / 2,
    };
    const perpendicularUp = { x: midpoint.x, y: midpoint.y - 50, z:  midpoint.z };
  
    // CALC ANGLES
    const yaw = getAngleBetweenLines(midpoint, noseTip, perpendicularUp);
    const turn = getAngleBetweenLines(midpoint, rightNose, noseTip);
  
    
      // const region2 = new Path2D();
      // region2.moveTo(leftNose.x, leftNose.y);
      // region2.lineTo(noseTip.x, noseTip.y);
      // region2.lineTo(rightNose.x, rightNose.y);
      // region2.lineTo(midpoint.x, midpoint.y);
      // region2.lineTo(leftNose.x, leftNose.y);
      // region2.closePath();
      // ctx.fillStyle = "brown";
      // ctx.stroke(region2);
      // ctx.fillText(Math.trunc(turn) + "°", 10, 160);
      // ctx.fill(region2);
  
      // const region = new Path2D();
      // region.moveTo(midpoint.x, midpoint.y);
      // region.lineTo(perpendicularUp.x, perpendicularUp.y);
      // region.lineTo(noseTip.x, noseTip.y);
      // region.lineTo(midpoint.x, midpoint.y);
      // region.closePath();
      // ctx.fillStyle = "red";
      // ctx.stroke(region);
      // ctx.fillText(Math.trunc(yaw) + "°", 10, 180);
      // ctx.fill(region);

  
    // CALC DISTANCE BETWEEN NOSE TIP AND MIDPOINT, AND LEFT AND RIGHT NOSE POINTS
    const zDistance = getDistanceBetweenPoints(noseTip, midpoint)
    const xDistance = getDistanceBetweenPoints(leftNose, rightNose)
  
    return {yaw, turn, zDistance, xDistance}
  }
  
  function getDistanceBetweenPoints(point1, point2) {
    const xDistance = point1.x - point2.x;
    const yDistance = point1.y - point2.y;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  }
  
  function getAngleBetweenLines(midpoint, point1, point2) {
    const vector1 = { x: point1.x - midpoint.x, y: point1.y - midpoint.y };
    const vector2 = { x: point2.x - midpoint.x, y: point2.y - midpoint.y };
  
    // Calculate the dot product of the two vectors
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  
    // Calculate the magnitudes of the vectors
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
    // Calculate the cosine of the angle between the two vectors
    const cosineTheta = dotProduct / (magnitude1 * magnitude2);
  
    // Use the arccosine function to get the angle in radians
    const angleInRadians = Math.acos(cosineTheta);
  
    // Convert the angle to degrees
    const angleInDegrees = (angleInRadians * 180) / Math.PI;
  
    return angleInDegrees;
  }



  // get luminiousity
  function getLuminosity(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS for external images
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let luminosity = 0;
  
        for (let i = 0; i < data.length; i += 4) {
          luminosity += (data[i] + data[i + 1] + data[i + 2]) / 3; // Average of R, G, B values
        }
  
        luminosity /= (data.length / 4); // Normalize to average
  
        resolve(luminosity);
      };
  
      img.onerror = (error) => {
        reject(error);
      };
  
      img.src = imageUrl;
    });
  }


  export const IrisEyeOval =(ctx, x, y, x1, y1, rx, ry)=>{
    // x = x -coordinate of the oval centre
    //y = y-coordinate of the oval centre
    // rx, ry = horizontal and vertical radius respectively
    const rotation = 0
    const startAngle = 0
    const endAngle = Math.PI * 2

    if(ry>32){
      ry=32
    }

    //eye ball
    ctx.fillStyle = 'white';
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, rotation, startAngle, endAngle)
    ctx.stroke()
    ctx.fill()


    //pupil
    ctx.fillStyle = 'blue';
    ctx.beginPath()
    ctx.ellipse(x1, y1, 10, 10, rotation, startAngle, endAngle)
    ctx.stroke()
    ctx.fill()
}


  const EyeOval =(ctx, x, y, rx, ry)=>{
      // x = x -coordinate of the oval centre
      //y = y-coordinate of the oval centre
      // rx, ry = horizontal and vertical radius respectively
      const rotation = 0
      const startAngle = 0
      const endAngle = Math.PI * 2

      if(ry>32){
        ry=32
      }

      //eye ball
      ctx.fillStyle = 'white';
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, rotation, startAngle, endAngle)
      ctx.stroke()
      ctx.fill()
      

      //pupil
      ctx.fillStyle = 'blue';
      ctx.beginPath()
      ctx.ellipse(x, y, 10, 10, rotation, startAngle, endAngle)
      ctx.stroke()
      ctx.fill()
  }




  const centerX = 40;
const centerY = 40;
const radius = 30;


export function drawCircles(yaw, pitch, ctx3, canvas3) {
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  // Calculate circle centers based on yaw and pitch
  const yawCircleCenterX = centerX + Math.sin(0) * radius;
  const yawCircleCenterY = centerY;

  const pitchCircleCenterX = centerX;
  const pitchCircleCenterY = centerY - Math.cos(0) * radius;

  // Draw yaw circle (red)
  ctx3.beginPath();
  ctx3.arc(yawCircleCenterX, yawCircleCenterY, radius, 0, 2 * Math.PI);
  ctx3.fillStyle = 'red';
  ctx3.fill();

  // Draw pitch circle (green)
  ctx3.beginPath();
  ctx3.arc(pitchCircleCenterX, pitchCircleCenterY, radius, 0, 2 * Math.PI);
  ctx3.fillStyle = 'green';
  ctx3.fill();
}