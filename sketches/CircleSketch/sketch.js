// @ts-nocheck


/* ----- setup ------ */







// sets up a bodystream with configuration object
const bodies = new BodyStream({
  posenet: posenet,
  architecture: modelArchitecture.MobileNetV1,
  detectionType: detectionType.singleBody,
  videoElement: document.getElementById('video'),
  samplingRate: 250
})



bodies.addEventListener('bodiesDetected', (e) => {
  body = e.detail.bodies.getBodyAt(0)
  const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))
  document.getElementById('output').innerText = `Distance between wrists: ${distance}`
  body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist)


})


// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let body

let increase = false;
let circleSize = 20;

let isFlipped = false;

let xpos = video.width / 2;
let ypos = video.height / 2;

let xdirection = 1; // Left or Right
let ydirection = 2;

function flipContext() {
  if (isFlipped == false) {
    ctx.translate(canvas.width, 0);
    // flip context horizontally
    ctx.scale(-1, 1);
    isFlipped = true;

  } else if (isFlipped == true) {
    ctx.translate(canvas.width, 0);
    // flip context horizontally
    ctx.scale(-1, 1);
    isFlipped = false;

  }
}

function stopIt() {
  bodies.stop();
  console.log("bye");
}

function startIt() {
  bodies.start();
  console.log("hello");
}
document.getElementById('stopButton').addEventListener('click', stopIt);
document.getElementById('startButton').addEventListener('click', startIt);




// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {
  flipContext();

  // draw the video element into the canvas
  ctx.drawImage(video, 0, 0, video.width, video.height);
  //ctx.clearRect(0, 0, canvas.width, canvas.height);


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
    const nose = body.getBodyPart(bodyParts.nose);
    const leftAnkle = body.getBodyPart(bodyParts.leftAnkle);
    const rightAnkle = body.getBodyPart(bodyParts.rightAnkle);
    const leftKnee = body.getBodyPart(bodyParts.leftKnee);
    const rightKnee = body.getBodyPart(bodyParts.rightKnee);












    //equilibrium of the body


    let centroidx = (nose.position.x + leftShoulder.position.x + rightShoulder.position.x + leftWrist.position.x + rightWrist.position.x + leftElbow.position.x + rightElbow.position.x + leftHip.position.x + rightHip.position.x) / 9;
    let centroidy = (nose.position.x + leftShoulder.position.y + rightShoulder.position.y + leftWrist.position.y + rightWrist.position.y + leftElbow.position.y + rightElbow.position.y + leftHip.position.y + rightHip.position.y) / 9;
    //console.log(centroidy);

    ctx.beginPath();
    let centroidCircle = ctx.arc(centroidx, centroidy, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = 'pink';
    
    
    



    //ctx.strokeRect(video.width/2 - 90,video.height/2-10, circleSize, circleSize);
    ctx.beginPath();
    let circle = ctx.arc(xpos, ypos, circleSize, 10, 0, 2 * Math.PI);
    //ctx.arc()
    ctx.fill();
    

    let newCenterCentroidx = centroidx - 10;
    let newCenterCirclex = xpos- circleSize;

    let newCenterCentroidy = centroidy;
    let newCenterCircley = ypos;

    let circleDistance = Math.sqrt(Math.pow((newCenterCentroidx-newCenterCirclex),2)+Math.pow((newCenterCentroidy-newCenterCircley),2))

    console.log(circleDistance);
    //console.log(newCenterCircle);

    if(circleDistance < circleSize) {
      console.log("true");
      ctx.fillStyle='pink';
    }else{
      ctx.fillStyle= 'white';
    } 



    if (increase == false) {
      circleSize = circleSize + 0.2;

    }

    if (increase == true) {
      circleSize = circleSize - 0.2;
    }

    if (circleSize > 150) {
      increase = true;
    }
    if (circleSize < 20) {
      increase = false;
    }

    xpos = xpos + 1 * xdirection;
    ypos = ypos + 1 * ydirection;

    if (xpos > video.width - circleSize || xpos < circleSize) {
      xdirection *= -1;
    }
    if (ypos > video.height - circleSize || ypos < circleSize) {
      ydirection *= -1;
    }
    
    
    


  }
  flipContext();

  requestAnimationFrame(drawCameraIntoCanvas)

}

/* ----- run ------ */

// start body detecting 

// draw video and body parts into canvas continously 

drawCameraIntoCanvas();