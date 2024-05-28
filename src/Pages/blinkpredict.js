
const EAR_THRESHOLD = 0.27;
let model;
let event;
let blinkCount = 0;

function getEucledianDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }


function getEAR(upper, lower) {
  
    return (
        (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1])
          + getEucledianDistance( upper[3][0],upper[3][1],lower[2][0],lower[2][1],)
        )
        / (2 * getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
      );
}


export async function startPrediciton(predictions, ctx) {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        
        // Right eye parameters
        const lowerRight = prediction.annotations.rightEyeUpper0;
        const upperRight = prediction.annotations.rightEyeLower0;
        const rightEAR = getEAR(upperRight, lowerRight);

        console.log("EAR ",rightEAR)

        // Left eye parameters
        const lowerLeft = prediction.annotations.leftEyeUpper0;
        const upperLeft = prediction.annotations.leftEyeLower0;
        const leftEAR = getEAR(upperLeft, lowerLeft);
  
        // True if the eye is closed
        let blinked = leftEAR <= EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD;
  
        // Determine how long you blinked
        if (blinked) {
            ctx.font = "20px Arial";
            ctx.fillText(" Blinked", 10, 80);
        } else {
            console.log("open: ")
        }
      });
    }
  }