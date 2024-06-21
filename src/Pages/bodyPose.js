export const AngleNoseSholder=(landmarks, ctx, canvas, img)=>{

    if(landmarks[0].length > 0){
        var deltaX = Math.abs(landmarks[0][0].x - landmarks[0][12].x);
        var deltaY = Math.abs(landmarks[0][0].y - landmarks[0][12].y);

        // dist 2 shoulders
        var shX = Math.abs(landmarks[0][11].x - landmarks[0][12].x);
        var shY = Math.abs(landmarks[0][11].y - landmarks[0][12].y);

        var dist = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY))
        var shd = Math.sqrt((shX*shX) + (shY*shY))

        var avd = shd/dist * 100
    
        // Calculate the angle in radians using arctangent
        const radians = Math.atan2(deltaY, deltaX);
    
        // Convert radians to degrees (optional)
        const degrees = (radians * 180) / Math.PI;
        const z_axis = landmarks[0][0].x * canvas.width
        const x_axis = landmarks[0][12].x * canvas.width
        deltaX = deltaX * canvas.width
        deltaY = deltaY * canvas.height



        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(degrees > 48){

            setTimeout(() => {
                
            }, 3000);
            
        }

        ctx.font = "20px Arial";
        ctx.fillText(" Shol Dis: "+shd, 10, 80);
        ctx.fillText(" Nose Shol: "+dist, 10, 140);
        ctx.fillText(" Av Dist: "+avd, 10, 170);


    
    }

    
}