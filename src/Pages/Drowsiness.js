

let blinkvalue = false
const EAR_THRESHOLD = 1.3;
let eye = [362, 385, 387, 263, 373, 380, 33, 160, 158, 133, 153, 144]
let righteye = [362, 385, 387, 263, 373, 380]
let lefteye = [33, 160, 158, 133, 153, 144]
let leftEAR = 0
let rightEAR = 0
let x
let y
let count = 0
let closed = false
let EAR


export const FaceMesh=(face, ctx, ctx1, ctx2, canvas, canvas1)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas1.width, canvas1.height);
    
    ctx.fillStyle = 'white';
    face.faceLandmarks.forEach(landmarks => {

    //Iris landmark
    if(landmarks.length == 478) {
        for(let i = 469; i < 473; i++) {
            let x = landmarks[i].x * canvas.width;
            let y = landmarks[i].y * canvas.height;

            ctx.beginPath();
            ctx.fillStyle= "red"
            ctx.rect(x, y, 2, 2);
            ctx.stroke();   
        }
    }

        // let {yaw, turn, zDistance, xDistance} = calculateDirection(ctx, landmarks)
        // ctx.font = "20px Arial";
        // ctx.fillText(yaw, 10, 150);
        // if(turn>=135){
        //     ctx.font = "20px Arial";
        //     ctx.fillText("Turn Left", 10, 120);
        // }else if(turn <=50){
        //     ctx.font = "20px Arial";
        //     ctx.fillText("Turn Right", 10, 120);
        // }else if(yaw <= 80){
        //     ctx.font = "20px Arial";
        //     ctx.fillText("Back head posture", 10, 170);
            
        // }
        

        for (let i = 0; i < eye.length; i++) {

            if(i >5){
                x = landmarks[eye[i]].x * canvas.width;
                y = landmarks[eye[i]].y * canvas.height;
    
                let EyeCoordinate = getEyeCoordinate(lefteye, landmarks, canvas)
                leftEAR =  eye_aspect_ratio(EyeCoordinate)
            }else if (i<6){
                x = landmarks[eye[i]].x * canvas.width;
                y = landmarks[eye[i]].y * canvas.height;
    
                let EyeCoordinate = getEyeCoordinate(righteye, landmarks, canvas)
                rightEAR =  eye_aspect_ratio(EyeCoordinate)
            }

            //drawing oval of eyes on canvas
            EyeOval(ctx1, 90, 70, 50, (10 * (leftEAR)) )
            EyeOval(ctx1, 210, 70, 50, (10 * (rightEAR)))


            //blick counter
            //if driver blinks too much in a short period, alert drowsiness
            ctx.fillText(" Blinked : "+ count, 10, 80);

            // True if the eye is closed
            let blinked = (leftEAR <= EAR_THRESHOLD) || (rightEAR <= EAR_THRESHOLD);

            // blink count incrementer
            if (blinked===true && blinkvalue === false) {
                count = count +1
            }
            blinkvalue = blinked;


            if(blinked){
              closed = true
            }else{
              closed = false
            }


            ctx.beginPath();
            ctx.fillStyle = 'aqua';
            ctx.arc(x, y, 1, 0, 2 * Math.PI); // Draw a circle for each landmark
            ctx.fill();
        }
    });

    // return {closed, leftEAR, yawn, roll, pitch}
    return closed
}



  const EyeOval =(ctx, x, y, rx, ry)=>{
      // x = x -coordinate of the oval centre
      //y = y-coordinate of the oval centre
      // rx, ry = horizontal and vertical radius respectively
      const rotation = 0
      const startAngle = 0
      const endAngle = Math.PI * 2

      if(ry>32){
        ry= 32
      }

      //eye ball
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, rotation, startAngle, endAngle)
      ctx.stroke()

      //pupil
      ctx.fillStyle = 'blue';
      ctx.beginPath()
      ctx.ellipse(x, y, 10, 10, rotation, startAngle, endAngle)
      ctx.stroke()
      ctx.fill()
  }