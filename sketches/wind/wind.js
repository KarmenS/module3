// @ts-nocheck

/* ----- setup ------ */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isFlipped = false;

let bubblesAmount = 12;

let bubbles = [];
let nodes = [];
let areaRadius = 100;

let counter = 0;

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.direction = 0;
    this.size = 15;
  }
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// sets up a bodystream with configuration object
const bodies = new BodyStream({
  posenet: posenet,
  architecture: modelArchitecture.MobileNetV1,
  detectionType: detectionType.singleBody,
  videoElement: document.getElementById("video"),
  samplingRate: 250,
});

let body;
flipContext();

// when a body is detected get body data
bodies.addEventListener("bodiesDetected", (e) => {
  body = e.detail.bodies.getBodyAt(0);
});

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {
  // draw the video element into the canvas
  ctx.clearRect(0,0,canvas.width, canvas.height)
  //ctx.drawImage(video, 0, 0, video.width, video.height);
 
 //Add bubbles
  if (bubbles.length < bubblesAmount) {
    bubbles.push(new Bubble(50, 50));
  }

  //create the points bubbles will follow
  createNodes(bubbles.length, areaRadius);

  //make bubbles follow the nodes
  for (let i = 0; i < bubbles.length; i++) {
    if (bubbles[i].x < nodes[i].x) {
      bubbles[i].x ++;
    }

    if (bubbles[i].x > nodes[i].x) {
      bubbles[i].x --;
    }

    if (bubbles[i].y < nodes[i].y) {
      bubbles[i].y ++;
    }

    if (bubbles[i].y > nodes[i].y) {
      bubbles[i].y -- ;
    }
  }
  counter += 0.01;

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
    const wristDist = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))

    //draw head
    ctx.beginPath();
    ctx.arc(nose.position.x, nose.position.y, eyeDist *1.7, 0, 2 * Math.PI);
    ctx.fillStyle = '#2B2A2A'
    ctx.fill()

    
    ctx.lineWidth= "20";
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
    
    
    /*
    drawPart(nose);
    drawPart(leftEye);
    drawPart(rightEye);
    drawPart(leftShoulder);
    drawPart(rightShoulder);
    drawPart(leftElbow);
    drawPart(rightElbow);
    drawPart(leftWrist);
    drawPart(rightWrist);
    drawPart(leftHip);
    drawPart(rightHip);
    drawPart(leftKnee);
    drawPart(rightKnee);
    drawPart(leftAnkle);
    drawPart(rightAnkle);
    */

    areaRadius = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))/3;
  
    
    for(let i = 0; i < bubbles.length; i++){
      let bubbleX = bubbles[i].x;
      let bubbleY = bubbles[i].y;
      let wristX = rightWrist.position.x;
      let wristY = rightWrist.position.y;

      let distanceWristAndBubble = Math.sqrt(Math.pow((bubbleX - wristX), 2) + Math.pow((bubbleY - wristY), 2))
      if(distanceWristAndBubble < 40){
        bubbles[i].velocityX = Math.atan((bubbles[i].y - rightWrist.position.y)/(bubbles[i].x - rightWrist.position.x)) * rightWrist.speed.absoluteSpeed;
        bubbles[i].velocityY = Math.asin((bubbles[i].y - rightWrist.position.y)/(bubbles[i].x - rightWrist.position.x)) * rightWrist.speed.absoluteSpeed;
        console.log(bubbles[i].velocityX);
        
        console.log("hit")

        bubbles[i].x += bubbles[i].velocityX/10;
        bubbles[i].y += bubbles[i].velocityX/10;

      } 

      

      if(bubbles[i].velocityX > 0){
      bubbles[i].velocityX --;
      }
      if(bubbles[i].velocityY > 0){
      bubbles[i].velocityY --;
      }
      if(bubbles[i].velocityX < 0){
        bubbles[i].velocityX ++;
      }
      if(bubbles[i].velocityY < 0){
        bubbles[i].velocityY ++;
      }
  

     // console.log("distance" + distanceWristAndBubble);
    }

    for(let i = 0; i < bubbles.length; i++){
      let bubbleX = bubbles[i].x;
      let bubbleY = bubbles[i].y;
      let NoseX = nose.position.x;
      let NoseY = nose.position.y;

      let distanceNoseAndBubble = Math.sqrt(Math.pow((bubbleX - NoseX), 2) + Math.pow((bubbleY - NoseY), 2))
      if(distanceNoseAndBubble < 40){
        bubbles[i].velocityX = Math.atan((bubbles[i].y - nose.position.y)/(bubbles[i].x - nose.position.x)) * nose.speed.absoluteSpeed;
        bubbles[i].velocityY = Math.asin((bubbles[i].y - nose.position.y)/(bubbles[i].x - nose.position.x)) * nose.speed.absoluteSpeed;
        console.log(bubbles[i].velocityX);
        
        console.log("hit")

        bubbles[i].x += bubbles[i].velocityX/3;
        bubbles[i].y += bubbles[i].velocityX/3;

      } 

      

      if(bubbles[i].velocityX > 0){
      bubbles[i].velocityX --;
      }
      if(bubbles[i].velocityY > 0){
      bubbles[i].velocityY --;
      }
      if(bubbles[i].velocityX < 0){
        bubbles[i].velocityX ++;
      }
      if(bubbles[i].velocityY < 0){
        bubbles[i].velocityY ++;
      }
  

     // console.log("distance" + distanceWristAndBubble);
    }
   // console.log(rightWrist.speed.absoluteSpeed)
    
  }

  

  for (let i = 0; i < bubbles.length; i++) {
    drawBubble(bubbles[i].x, bubbles[i].y, bubbles[i].size);
  }
  window.requestAnimationFrame(drawCameraIntoCanvas);
}

function drawPart(part){
  ctx.beginPath();
  ctx.arc(part.position.x, part.position.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

function drawBubble(x, y, size) {
  ctx.beginPath();
  ctx.fillStyle = "#B0F1FA";
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
}

function createNodes(numNodes, radius) {
  nodes = [];
  let width = radius * 2 + 50;
  let height = radius * 2 + 50;
  let angle;
  let x;
  let y;
  let i;
  for (i = 0; i < numNodes; i++) {
    angle = ((i + counter) / (numNodes / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
    x = canvas.width / 2 - radius + radius * Math.cos(angle) + width / 2; // Calculate the x position of the element.
    y = canvas.height / 2 - radius + radius * Math.sin(angle) + width / 2; // Calculate the y position of the element.

    nodes.push(new Node(x, y));
  }
  
  
}

function connectParts(part1, part2) {
  ctx.strokeStyle= "#2B2A2A";
  ctx.lineWidth= "20";
  ctx.moveTo(part1.position.x, part1.position.y);
  ctx.lineTo(part2.position.x, part2.position.y);
  ctx.stroke();
}

function flipContext(){
  if(isFlipped == false){
      ctx.translate(canvas.width, 0);
      // flip context horizontally
      ctx.scale(-1, 1);
      isFlipped = true;
      
  } else if(isFlipped == true){
      ctx.translate(canvas.width, 0);
      // flip context horizontally
      ctx.scale(-1, 1);
      isFlipped = false;
  
  }
  }
  






/* ----- run ------ */

// start body detecting
bodies.start();
// draw video and body parts into canvas continously
drawCameraIntoCanvas();
