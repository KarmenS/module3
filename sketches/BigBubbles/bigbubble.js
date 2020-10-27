// @ts-nocheck

/* ----- setup ------ */

//setting up variables
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isFlipped = false;

let bubblesAmount = 12;
let centroid;

let bubbles = [];
let nodes = [];
let areaRadius = 100;
let averageDistToCentroid;

let bubbleSpeed = 1;
let nodeSpeed = 0.5;

//counts the "time" since the sketch started to gradually move the nodes around in a circle
let counter = 0;

//schematics for bubbles and node objects
class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.direction = 0;
    this.size = 110;
    this.ShouldShiver = false;
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
  samplingRate: 50, //changing this changes the speed at which the body updates, lower the number faster the updates. (250 originally)
});

let body;
flipContext();

// when a body is detected get body data
bodies.addEventListener("bodiesDetected", (e) => {
  body = e.detail.bodies.getBodyAt(0);
});

// draw the video
function drawCameraIntoCanvas() {
  // draw the video element into the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      bubbles[i].x+= bubbleSpeed;
    }

    if (bubbles[i].x > nodes[i].x) {
      bubbles[i].x-=bubbleSpeed;
    }

    if (bubbles[i].y < nodes[i].y) {
      bubbles[i].y+=bubbleSpeed;
    }

    if (bubbles[i].y > nodes[i].y) {
      bubbles[i].y-=bubbleSpeed;
    }
  }

  //adds to the "time" passed
  counter += 0.01;

  if (body) {
    //sets up bodyparts, unused ones should be removed when we commit to something.
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

    //distance-containers - unused atm
    const eyeDist = Math.round(
      body.getDistanceBetweenBodyParts(bodyParts.leftEye, bodyParts.rightEye)
    );
    const wristDist = Math.round(
      body.getDistanceBetweenBodyParts(
        bodyParts.leftWrist,
        bodyParts.rightWrist
      )
    );
    let centroidSpeed = 
    (rightWrist.speed.absoluteSpeed + 
    leftWrist.speed.absoluteSpeed +
    leftShoulder.speed.absoluteSpeed +
    leftKnee.speed.absoluteSpeed +
    rightShoulder.speed.absoluteSpeed +
    rightKnee.speed.absoluteSpeed) /
    6;
  
    console.log(bubbleSpeed)

    //Mapping the speed
    bubbleSpeed +=  centroidSpeed/700 
    * 0.3;
    nodeSpeed = 0.01 + centroidSpeed/700 
    * 0.3


    if (bubbleSpeed >= 0){
      bubbleSpeed -= 0.05
    }
     if (nodeSpeed >= 0){
      nodeSpeed -= 0.05
    }
    //updates the centroid position
    centroid = {
      radius: 50,
      x:
        (leftShoulder.position.x +
          rightShoulder.position.x +
          leftWrist.position.x +
          rightWrist.position.x +
          leftKnee.position.x +
          rightKnee.position.x) /
        6,
      y:
        (leftShoulder.position.y +
          rightShoulder.position.y +
          leftWrist.position.y +
          rightWrist.position.y +
          leftKnee.position.y +
          rightKnee.position.y) /
        6,
    };

    //draw center of the cloud
    
    // ctx.beginPath();
    // ctx.arc(centroid.x, centroid.y, centroid.radius, 0, 2 * Math.PI);
    // ctx.fillStyle = "#2B2A2A";
    // ctx.fill();
    
    
     
    //the centroid of the circle doesn't appear to be in the middle of
    //the abstract pink shape  I created so maybe to look into aswell.

    //draws the cloud
    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.moveTo(leftShoulder.position.x , leftShoulder.position.y);
    ctx.lineTo(rightShoulder.position.x, rightShoulder.position.y);
    // ctx.lineTo(rightKnee.position.x, rightKnee.position.y);
    ctx.lineTo(rightWrist.position.x, rightWrist.position.y);
    ctx.lineTo(rightKnee.position.x, rightKnee.position.y);
    ctx.lineTo(leftKnee.position.x, leftKnee.position.y);
    ctx.lineTo(leftWrist.position.x, leftWrist.position.y);

    ctx.fillStyle = "pink";
    ctx.fill();
    
    averageDistToCentroid =
(distToCentroid(leftWrist) +
distToCentroid(leftShoulder) + 
distToCentroid(rightShoulder) + 
distToCentroid(rightKnee) + 
distToCentroid(leftKnee) + 
distToCentroid(rightWrist)) /
6;
console.log(averageDistToCentroid);
 
    //calculates distance between wrists to use for radius of the nodes.
    areaRadius = 150;
      // Math.round(
      //   body.getDistanceBetweenBodyParts(
      //     bodyParts.leftWrist,
      //     bodyParts.rightWrist
      //   )
      // ) / 3;
      
    
    //loop to check for collision
    for (let i = 0; i < bubbles.length; i++) {
      let bubbleX = bubbles[i].x;
      let bubbleY = bubbles[i].y;

      let distanceCentroidAndBubble = Math.sqrt(
        Math.pow(bubbleX - centroid.x, 2) + Math.pow(bubbleY - centroid.y, 2)
      );
      if (distanceCentroidAndBubble < averageDistToCentroid) {
        bubbles[i].velocityX =
          Math.atan(
            (bubbles[i].y - nose.position.y) / (bubbles[i].x - nose.position.x)
          ) * nose.speed.absoluteSpeed;
        bubbles[i].velocityY =
          Math.asin(
            (bubbles[i].y - nose.position.y) / (bubbles[i].x - nose.position.x)
          ) * nose.speed.absoluteSpeed;
        

        //alters the position of bubbles
        bubbles[i].x += bubbles[i].velocityX / 3;
        bubbles[i].y += bubbles[i].velocityX / 3;
      }

      //makes the bubbles shiver once you're close, but not too close. This will be changed, to shiver when they're within the pink cloud
      if (distanceCentroidAndBubble < averageDistToCentroid) {
        bubbles[i].ShouldShiver = true;
      } else {
        bubbles[i].ShouldShiver = false;
      }

      //returns the velocity 
      if (bubbles[i].velocityX > 0) {
        bubbles[i].velocityX--;
      }
      if (bubbles[i].velocityY > 0) {
        bubbles[i].velocityY--;
      }
      if (bubbles[i].velocityX < 0) {
        bubbles[i].velocityX++;
      }
      if (bubbles[i].velocityY < 0) {
        bubbles[i].velocityY++;
      }
    }
  }

  //draws all the bubbles 
  for (let i = 0; i < bubbles.length; i++) {
    drawBubble(bubbles[i].x, bubbles[i].y, bubbles[i].size);
  }

  //executes the shiver thing
 // shiver();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}

//helper functions 
function drawPart(part) {
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

//function to create the nodes
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

//another helper function
function connectParts(part1, part2) {
  ctx.strokeStyle = "#2B2A2A";
  ctx.lineWidth = "20";
  ctx.moveTo(part1.position.x, part1.position.y);
  ctx.lineTo(part2.position.x, part2.position.y);
  ctx.stroke();
}

//function to check if bubbles should shiver and then does it.
function shiver() {
  for (let i = 0; i < bubbles.length; i++) {
    if (bubbles[i].ShouldShiver === true) {
      bubbles[i].x += Math.random() * 10 - 5;
    }
  }
}

//flips the context to improve the physiology
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




function distToCentroid(part){
  let dist = Math.sqrt(
    Math.pow(part.position.x - centroid.x, 2) + Math.pow(part.position.y - centroid.y, 2)
  );
  return dist;
  
}

/* ----- run ------ */

// start body detecting
bodies.start();
// draw video and body parts into canvas continously
drawCameraIntoCanvas();
