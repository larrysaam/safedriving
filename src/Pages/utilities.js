

// Helper function to calculate Euclidean distance
function euclideanDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
function disttwo( y1, y2) {
    const dy = y2 - y1;
    return Math.sqrt(dy * dy);
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

let count = 0
export const FaceMesh=(face, ctx, canvas)=>{
    let righteye = [362, 385, 387, 263, 373, 380]
  

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    face.faceLandmarks.forEach(landmarks => {
        landmarks.forEach(landmark => {
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 1, 0, 2 * Math.PI); // Draw a circle for each landmark
            ctx.fill();
        });

        for (let i = 0; i < righteye.length; i++) {
            let x = landmarks[righteye[i]].x * canvas.width;
            let y = landmarks[righteye[i]].y * canvas.height;

            let EyeCoordinate = getEyeCoordinate(righteye, landmarks, canvas)
            let ear =  eye_aspect_ratio(EyeCoordinate)


            //True if the eye is closed
            let blinked = ear <= 1.7
    
            ctx.font = "20px Arial";
            ctx.fillText(" EAR = " +ear, 10, 120);


            // Determine how long you blinked
            if (blinked) {
                ctx.font = "20px Arial";
                ctx.fillText(" Eye  Closed ", 10, 80);
            } else {
                console.log("open: ")
            }

            console.log(x, y)
            ctx.beginPath();
            ctx.fillStyle = 'aqua';
            ctx.arc(x, y, 1, 0, 2 * Math.PI); // Draw a circle for each landmark
            ctx.fill();
        }
    });
}