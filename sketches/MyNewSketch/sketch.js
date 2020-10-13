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
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftHip, bodyParts.rightHip))
    document.getElementById('output').innerText = `Distance between hips: ${distance}`
    body.getDistanceBetweenBodyParts(bodyParts.leftHip, bodyParts.rightHip)
})

// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function stopIt(){
    bodies.stop();
    console.log("hello");
}
document.getElementById('stopButton').addEventListener('click', stopIt);

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    if (body) {
        // draw circle for left and right wrist
        const leftShoulder = body.getBodyPart(bodyParts.leftShoulder);
        const rightShoulder = body.getBodyPart(bodyParts.rightShoulder);
        const leftWrist = body.getBodyPart(bodyParts.leftWrist);
        const rightWrist = body.getBodyPart(bodyParts.rightWrist);
        const leftHip = body.getBodyPart(bodyParts.leftHip);
        const rightHip = body.getBodyPart(bodyParts.rightHip);
        const leftElbow = body.getBodyPart(bodyParts.leftElbow);
        const rightElbow = body.getBodyPart(bodyParts.rightElbow);
     

        // draw left wrist
        ctx.beginPath();
        ctx.arc(leftHip.position.x, leftHip.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'pink'
        ctx.fill()

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightHip.position.x, rightHip.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'pink'
        ctx.fill()

        ctx.beginPath();
        ctx.arc(leftElbow.position.x, leftElbow.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow'
        ctx.fill()

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightElbow.position.x, rightElbow.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow'
        ctx.fill()

        ctx.beginPath();
        ctx.arc(leftShoulder.position.x, leftShoulder.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue'
        ctx.fill()

        // draw right wrist
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

 
 
