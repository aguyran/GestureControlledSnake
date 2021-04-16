let mobilenet;
let classifier;
let video;
let direction = 'right';
let noOfUpImages=0;
let noOfDownImages=0;
let noOfLeftImages=0;
let noOfRightImages=0;
let videoElement=document.getElementById("videoElement");
let canv=document.getElementById("random");
ctx=canv.getContext("2d");
setInterval(game,1000/15);

numClasses=4;
numLabels=4;

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
.then(function(stream) {
    videoElement.srcObject = stream;
    videoElement.play();
    mobilenet = ml5.featureExtractor('MobileNet', modelReady);
    mobilenet.numClasses=numClasses;
    mobilenet.numLabels=numLabels;
    console.log(mobilenet);
    classifier = mobilenet.classification(videoElement, videoReady);
    
})
.catch(function(err) {
    console.log("An error occurred while trying to use the webcam " + err);
});

function modelReady() {
    console.log('Model is ready!');
   
  }

function videoReady() {
    console.log('Video is ready!!!');
    
    
  }

function whileTraining(loss) {
if (loss == null) {
    console.log('Training Complete');
    classifier.classify(gotResults);
} else {
    console.log(loss);
}
}

function gotResults(error, result) {
if (error) {
    console.error(error);
} else {
    direction = result;
    
    console.log(direction);
    keyPresses();
    classifier.classify(gotResults);
   
}
}



function upDir(){
    noOfUpImages++;
    classifier.addImage('up');
    document.getElementById("upBtn").innerHTML= "Up  "+noOfUpImages;
    
}
function downDir(){
    noOfDownImages++;
    classifier.addImage('down');
    document.getElementById("downBtn").innerHTML= "Down "+noOfDownImages;
}
function leftDir(){
    noOfLeftImages++;
    classifier.addImage('left');
    document.getElementById("leftBtn").innerHTML= "Left "+noOfLeftImages;
}
function rightDir(){
    noOfRightImages++;
    classifier.addImage('right');
    document.getElementById("rightBtn").innerHTML= "Right "+noOfRightImages;
}
function trainmdl(){
    classifier.train(whileTraining);
}
/*xv = X Velocity,yv = Y Velocity
px = Player X, py = Player Y
gs = Grid Size,tc = Tile Count
ax = Apple X, Apple Y
Trail Stores Previous Position Upto Tail Size*/
/*Snake Game attributed to https://www.youtube.com/watch?v=xGmXxpIj6vs
with some modifications for controls with CNN*/
px=py=10;
gs=tc=20;//20*20 = 400size
ax=ay=15;
xv=yv=0;
trail=[];
tail = 5;
function game() {
    px+=xv;
    py+=yv;
    if(px<0) {
        px= tc-1;
    }
    if(px>tc-1) {
        px= 0;
    }
    if(py<0) {
        py= tc-1;
    }
    if(py>tc-1) {
        py= 0;
    }
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
 
    ctx.fillStyle="lime";
    for(var i=0;i<trail.length;i++) {
        ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
        if(trail[i].x==px && trail[i].y==py) {
            tail = 5;
        }
    }
    trail.push({x:px,y:py});
    while(trail.length>tail) {
    trail.shift();
    }
 
    if(ax==px && ay==py) {
        tail++;
        ax=Math.floor(Math.random()*tc);
        ay=Math.floor(Math.random()*tc);
    }
    ctx.fillStyle="red";
    ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
}
function keyPresses() {
    switch(direction) {
        case "left":
            xv=-1;yv=0;
            break;
        case "up":
            xv=0;yv=-1;
            break;
        case "right":
            xv=1;yv=0;
            break;
        case "down":
            xv=0;yv=1;
            break;
    }
}