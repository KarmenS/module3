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
    //const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))
    //document.getElementById('output').innerText = `Distance between wrists: ${distance}`
    body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist)
    
    
})

// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let canvas2 = document.getElementById("canvas2");
let ctx = canvas.getContext("2d");
let ctx2= canvas2.getContext("2d");

let isFlipped = false;
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

let isFlipped2 = false;
function flipContext2(){
if(isFlipped2 == false){
    ctx2.translate(canvas2.width, 0);
    // flip context horizontally
    ctx2.scale(-1, 1);
    isFlipped2 = true;
    
} else if(isFlipped2 == true){
    ctx2.translate(canvas2.width, 0);
    // flip context horizontally
    ctx2.scale(-1, 1);
    isFlipped2= false;

}
}



// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {
    flipContext();
    flipContext2();

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
        //console.log(" Xpos: " + rightWrist.position.x);
        
        
    //     ctx.beginPath();
    //     ctx.moveTo(nose.position.x, nose.position.y);
    //     ctx.lineTo(rightWrist.position.x, rightWrist.position.y);
    //    // ctx.lineTo(rightKnee.position.x, rightKnee.position.y);
    //     ctx.lineTo(rightAnkle.position.x, rightAnkle.position.y);
    //     ctx.lineTo(leftAnkle.position.x, leftAnkle.position.y);
    //     //ctx.lineTo(leftKnee.position.x, leftKnee.position.y);
    //     ctx.lineTo(leftWrist.position.x, leftWrist.position.y);
    //     ctx.fill();
        
        
        


        ctx.strokeRect(50, 250, 100, 100);
        ctx.strokeStyle = 'pink';
        
        ctx2.beginPath();
        ctx2.moveTo(rightWrist.position.x, rightWrist.position.y);
        ctx2.lineTo(leftWrist.position.x, leftWrist.position.y);
        ctx2.stroke();
        ctx2.lineWidth="5";
        ctx2.strokeStyle = 'blue';

        ctx2.beginPath();
        ctx2.moveTo(rightHip.position.x, rightHip.position.y);
        ctx2.lineTo(leftHip.position.x, leftHip.position.y)
        ctx2.stroke();
        ctx2.strokeStyle = 'pink';
        

        connectParts(leftShoulder, rightShoulder);
        // draw left wrist
        // ctx.beginPath();
        // ctx.arc(leftHip.position.x, leftHip.position.y, 10, 0, 2 * Math.PI);
        // ctx.fillStyle = 'pink'
        // ctx.fill()

        // draw right wrist
       

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
    flipContext2();
    requestAnimationFrame(drawCameraIntoCanvas)
}

function connectParts(part1, part2) {
    ctx.strokeStyle= "#2B2A2A";
    ctx.lineWidth= "10";
    ctx.moveTo(part1.position.x, part1.position.y);
    ctx.lineTo(part2.position.x, part2.position.y);
    ctx.stroke();
  }
/* ----- run ------ */

// start body detecting 
bodies.start();
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();

 
 
