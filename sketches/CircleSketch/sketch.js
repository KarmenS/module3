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
let squareSize = 20;

let isFlipped = false;

let xpos = video.width / 2;
let ypos = video.height /2;

let xdirection = 0.5; // Left or Right
let ydirection = 0.5;

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










    // if(rightWrist.position.x > 150 && rightWrist.position.x < 170 ){
    //     ctx.strokeStyle = 'black';
    // }

    //equilibrium of the body


    let centroidx = (nose.position.x + leftShoulder.position.x + rightShoulder.position.x + leftWrist.position.x + rightWrist.position.x + leftElbow.position.x + rightElbow.position.x + leftHip.position.x + rightHip.position.x) / 9;
    let centroidy = (nose.position.x + leftShoulder.position.y + rightShoulder.position.y + leftWrist.position.y + rightWrist.position.y + leftElbow.position.y + rightElbow.position.y + leftHip.position.y + rightHip.position.y) / 9;
    //console.log(centroidy);

    ctx.beginPath();
    ctx.arc(centroidx, centroidy, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'pink';
    ctx.fill();


    

    //ctx.strokeRect(video.width/2 - 90,video.height/2-10, squareSize, squareSize);
    ctx.beginPath();
    ctx.arc(xpos, ypos, squareSize, 10, 0, 2 * Math.PI);
    //ctx.arc()
    ctx.stroke();

    if (increase == false) {
      squareSize = squareSize + 0.2;

    }

    if (increase == true) {
      squareSize = squareSize - 0.2;
    }

    if (squareSize > 150) {
      increase = true;
    }
    if (squareSize < 20) {
      increase = false;
    }

    xpos = xpos +1 * xdirection;
    ypos = ypos +1 * ydirection;

    if (xpos > video.width - squareSize || xpos < squareSize ) {
      xdirection *= -1;
    }
    if (ypos > video.height - squareSize || ypos < squareSize ) {
      ydirection *= -1;
    }



    //ctx.fillRect(50, 50, 100, 100);
    ctx.strokeStyle = 'pink';

    if (centroidx < 260 && centroidx > 225 && centroidy < 400 && centroidy > 370) {

      ctx.strokeStyle = 'blue'
    }

    if (centroidx < 260 && centroidx > 225 && centroidy < 237 && centroidy > 200) {

      ctx.strokeStyle = 'purple'
    }

    if (centroidx < 435 && centroidx > 400 && centroidy < 400 && centroidy > 370) {

      ctx.strokeStyle = 'green'
    }

    if (centroidx < 435 && centroidx > 400 && centroidy < 237 && centroidy > 200) {

      ctx.strokeStyle = 'yellow'
    }


    // draw left wrist
    // ctx.beginPath();
    // ctx.arc(leftHip.position.x, leftHip.position.y, 10, 0, 2 * Math.PI);
    // ctx.fillStyle = 'pink'
    // ctx.fill()

    // // draw right wrist
    // ctx.beginPath();
    // ctx.arc(rightHip.position.x, rightHip.position.y, 10, 0, 2 * Math.PI);
    // ctx.fillStyle = 'pink'
    // ctx.fill()

    // ctx.beginPath();
    // ctx.arc(leftElbow.position.x, leftElbow.position.y, 10, 0, 2 * Math.PI);
    // ctx.fillStyle = 'red'
    // ctx.fill()

    // // draw right wrist
    // ctx.beginPath();
    // ctx.arc(rightElbow.position.x, rightElbow.position.y, 10, 0, 2 * Math.PI);
    // ctx.fillStyle = 'yellow'
    // ctx.fill()

    // ctx.beginPath();
    // ctx.arc(leftShoulder.position.x, leftShoulder.position.y, 10, 0, 2 * Math.PI);
    // ctx.fillStyle = 'blue'
    // ctx.fill()

    // // draw right wrist
    // ctx.beginPath();
    // ctx.arc(rightShoulder.position.x, rightShoulder.position.y, 10, 0, 2 * Math.PI);
    // ctx.fillStyle = 'blue'
    // ctx.fill()
  }
  flipContext();

  requestAnimationFrame(drawCameraIntoCanvas)

}

/* ----- run ------ */

// start body detecting 

// draw video and body parts into canvas continously 

drawCameraIntoCanvas();