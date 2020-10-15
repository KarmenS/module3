// @ts-nocheck


/* ----- setup ------ */

// sets up a bodystream with configuration object
const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 250})
    
let body

bodies.addEventListener('bodiesDetected', (e) => {
    body = e.detail.bodies.getBodyAt(0)
    const wristsDistance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))
    
    if(wristsDistance < 30){
        console.log("wrists connected");
    }

    const LwristToRShoulderDistance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightShoulder))

    if(LwristToRShoulderDistance < 30){
        console.log("left wrist and right shoulder connected");
    }

    const RwristToLShoulderDistance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.rightWrist, bodyParts.leftShoulder))

    if(RwristToLShoulderDistance < 30){
        console.log("Right wrist and left shoulder connected");
   }

})

// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
 // translate context to center of canvas
 ctx.translate(canvas.width / 1, canvas.height / 10);

 // flip context horizontally
 ctx.scale(-1, 1);

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    if (body) {
        // draw circle for left and right wrist
        const leftWrist = body.getBodyPart(bodyParts.leftWrist)
        const rightWrist = body.getBodyPart(bodyParts.rightWrist)
        const leftShoulder = body.getBodyPart(bodyParts.leftShoulder)
        const rightShoulder = body.getBodyPart(bodyParts.rightShoulder)

        // draw left wrist
        ctx.beginPath();
        ctx.arc(leftWrist.position.x, leftWrist.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

         // draw left shoulder
         ctx.beginPath();
         ctx.arc(leftShoulder.position.x, leftShoulder.position.y, 10, 0, 2 * Math.PI);
         ctx.fillStyle = 'blue'
         ctx.fill()
 
         // draw right shoulder
         ctx.beginPath();
         ctx.arc(rightShoulder.position.x, rightShoulder.position.y, 10, 0, 2 * Math.PI);
         ctx.fillStyle = 'blue'
         ctx.fill()
    }
    requestAnimationFrame(drawCameraIntoCanvas)
}

/* ----- run ------ */

// start body detecting 
bodies.start()
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();