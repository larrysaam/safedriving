export function getDeviceOrientation(canvas, ctx) {

    if (window.DeviceOrientationEvent) {
        const handleOrientation = (event) => {
          const alpha = event.alpha; // Rotation around the Z-axis (degrees)
          const beta = event.beta; // Rotation around the X-axis (degrees)
          const gamma = event.gamma; // Rotation around the Y-axis (degrees)
  
          // Convert angles to radians and adjust for device orientation (complex, might require calibration)
          const radAlpha = alpha * (Math.PI / 180);
          const radBeta = beta * (Math.PI / 180);
          const radGamma = gamma * (Math.PI / 180);
  
          const directionX = Math.sin(radAlpha) * Math.cos(radBeta);
          const directionY = Math.sin(radBeta);
          const directionZ = Math.cos(radAlpha) * Math.cos(radBeta);
  
          console.log([directionX, directionY, directionZ]);
        };
  
        window.addEventListener('deviceorientation', handleOrientation);
  
        return () => window.removeEventListener('deviceorientation', handleOrientation);
      } else {
        console.error('DeviceOrientation API not supported');
      }

   window.addEventListener('deviceorientation', (event)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillText((event.alpha).toFixed(1), 10, 190);
    ctx.fillText((event.beta).toFixed(1), 10, 215);
    ctx.fillText((event.gamma).toFixed(1), 10, 240);
   })
    
}