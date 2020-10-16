// @ts-nocheck


/* ----- setup ------ */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// sets up a bodystream with configuration object
const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 250})

let body

// when a body is detected get body data
bodies.addEventListener('bodiesDetected', (e) => {
    body = e.detail.bodies.getBodyAt(0)
})

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {
 
  // draw the video element into the canvas
  ctx.clearRect(0,0,canvas.width, canvas.height)
 //ctx.drawImage(video, 0, 0, video.width, video.height);
 
  
 // draw nose and eyes
 if (body) {
    const nose = body.getBodyPart(bodyParts.nose);
    const leftEye = body.getBodyPart(bodyParts.leftEye);
    const rightEye = body.getBodyPart(bodyParts.rightEye);
    const leftShoulder = body.getBodyPart(bodyParts.leftShoulder);
    const rightShoulder = body.getBodyPart(bodyParts.rightShoulder);
    const leftElbow = body.getBodyPart(bodyParts.leftElbow);
    const rightElbow = body.getBodyPart(bodyParts.rightElbow);
    const leftWrist = body.getBodyPart(bodyParts.leftWrist);
    const rightWrist = body.getBodyPart(bodyParts.rightWrist);
    const leftHip = body.getBodyPart(bodyParts.leftHip);
    const rightHip = body.getBodyPart(bodyParts.rightHip);
    const leftKnee = body.getBodyPart(bodyParts.leftKnee);
    const rightKnee = body.getBodyPart(bodyParts.rightKnee);
    const leftAnkle = body.getBodyPart(bodyParts.leftAnkle);
    const rightAnkle = body.getBodyPart(bodyParts.rightAnkle);
   
    const eyeDist = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftEye, bodyParts.rightEye))
    console.log(eyeDist);

    // draw nose
    ctx.beginPath();
    ctx.arc(nose.position.x, nose.position.y, eyeDist *1.7, 0, 2 * Math.PI);
    ctx.fillStyle = '#2B2A2A'
    ctx.fill()

    connectParts(leftShoulder, rightShoulder);
    connectParts(leftShoulder, leftElbow);
    connectParts(leftElbow, leftWrist);
    connectParts(rightShoulder, rightElbow);
    connectParts(rightElbow, rightWrist);
    connectParts(rightShoulder, rightHip);
    connectParts(leftShoulder, leftHip);
    connectParts(leftHip, rightHip);
    connectParts(leftHip,leftKnee);
    connectParts(rightHip,rightKnee);
    connectParts(leftKnee, leftAnkle);
    connectParts(rightKnee, rightAnkle);


   
 }
  window.requestAnimationFrame(drawCameraIntoCanvas);
}

// helper function to draw a star
function connectParts(part1, part2) {
  ctx.strokeStyle= "#2B2A2A";
  ctx.lineWidth= "20";
  ctx.moveTo(part1.position.x, part1.position.y);
  ctx.lineTo(part2.position.x, part2.position.y);
  ctx.stroke();
}


/* ----- run ------ */

// start body detecting 
bodies.start()
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();
