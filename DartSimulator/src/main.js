/* jshint browser:true */
/* globals createjs */


//I'm relying on globals a lot here, not sure how to get around this when each thing has to interact with the display.
var canvas, stage, background, target;
var bgscale;
var dartboardOrder = [11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8];
var score = 0;
let scoreDisplay;

//define the array of three darts
let darts = [];
let currentDart = 0;

//define the array of reactions
reactions = [];

///window.addEventListener('resize', resize, false);
/*
On resize we have to reslign the background so that the game continues to make sense
*/
//TODO: Probably can't get resize to work because of these? should be using the other x and y numbers
//TODO: also something about resizing a container instead of the actual stage? I have no idea.

function resize() {
  let innerscale = window.innerHeight / parseFloat(canvas.height);
  stage.scaleX = stage.scaleY = innerscale;

  // set canvas width
  canvas.style.width  = window.innerHeight;
  // set canvas height
  canvas.style.height = window.innerHeight;
  stage.update();
}


/*
Run once the basic dom has been loaded.
Loads all the required assets asynchronously and calls the complete method once ready.
*/
function init() {
  // get a reference to the canvas we'll be working with:
  canvas = document.getElementById("mainCanvas");

  // set canvas width
  canvas.width = window.innerWidth;
  // set canvas height
  canvas.height = window.innerHeight;

  adjustLoadingScreen();

  // create a stage object to work with the canvas. This is the top level node in the display list:
  stage = new createjs.Stage(canvas);
  stage.canvas.style.cursor = "none";


  manifest = [
    {src: "target.png", id: "target"},
    {src: "theboard.png", id: "background"},
    {src: "throw.png", id: "throw"},
    {src: "fail.png", id: "fail"},
    {src: "uhhh.png", id: "uhhh"},
    {src: "noice.png", id: "noice"},
    {src: "2clutch.png", id: "2clutch"},
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest, true, "assets/");
}

/*
once all assets are loaded this sets up the actual game.
defines the board, and sets it to the correct size and location.
Creates needed sprites/animations
*/
function handleComplete() {

  //Set up background image and centre/scale it.
  bgimg = loader.getResult("background");
  background = new createjs.Bitmap(bgimg);

  scale = canvas.height/parseFloat(bgimg.height);

  background.scaleX = canvas.height/bgimg.width;
  background.scaleY = canvas.height/bgimg.height;

  // set background x location in canvas
  background.x = (canvas.width - bgimg.width * background.scaleX) / 2;
  // set background y location in canvas
  background.y = 0;

  //Loading the sprites========================================
  var targetSpriteSheet = new createjs.SpriteSheet({
    framerate: 10,
    images: [loader.getResult("target")],
    frames: {width:56, height:55},
    animations: {
      spin:[0, 3]
    }
  });
  let target = new createjs.Sprite(targetSpriteSheet, "spin");

  //shift drawing to centre of the sprite.
  target.regX = 28;
  target.regY = 28;

  let dartSpriteSheet = new createjs.SpriteSheet({
    framerate: 20,
    images: [loader.getResult("throw")],
    frames: {width:76, height:125},
    animations: {
      throw:[0, 9, "thrown", 1],
      thrown:9
    }
  });

  loadReactions();

  //initialize the three dart array
  for(i = 0; i < 3; i++) {
    darts.push(new createjs.Sprite(dartSpriteSheet, "throw"));
    darts[i].stop();
    darts[i].visible = false;
    darts[i].regX = 24;
    darts[i].regY = 81;
    darts[i].addEventListener("animationend", udpdateScore);
  }

  //background click listeners
  background.addEventListener("click", throwDart);

  stage.addEventListener("stagemousemove", function(event) {
    //Glue the target crosshairs to the cursor
    target.x = event.stageX;
    target.y = event.stageY;
  });

  scoreDisplay = new createjs.Text("Score: 0", "30px fantasy", "#EEE");
  scoreDisplay.x = 4;

  // add the background as a child of the stage. This means it will be drawn any time the stage is updated
  // and that its transformations will be relative to the stage coordinates:
  let container = new createjs.Container();
  container.addChild(background);
  container.addChild(darts[0]);
  container.addChild(darts[1]);
  container.addChild(darts[2]);
  stage.addChild(container);
  stage.addChild(scoreDisplay);
  for (let reaction of reactions) {
    stage.addChild(reaction);
  }
  stage.addChild(target); //Add last so it remains on top of the darts in the baord

  // call update on the stage to make it render the current display list to the canvas:
  stage.update();

  createjs.Ticker.timingMode = createjs.Ticker.RAF; //request animation frame method, to save cpu cycles
  createjs.Ticker.addEventListener("tick", tick);

  hideLoadingScreen();
}

function tick(event) {
  stage.update(event);
}


/*
Evaluate the point value of the dart landing location.
*/
function evaluatePoints(x, y) {
  // h is already the height, and since square, the width of the board.
  //centre coords of board are: 752, 745 in the image

  //These are the breakpoints of the sections on the board png that I am using.
  let radii = [0, 22, 51, 297, 326, 489, 519];
  //We need to check that dist < r in radii
  //want to check sqrt(x^2 + y^2) < r
  //can also check x^2 + y^2 < r^2
  radii = radii.map(x => x*x*scale*scale);

  //centre of screen, hopefully the image lines up properly.
  let centreX = canvas.width/2;
  let centreY = canvas.height/2;

  //shift from screen coordinates to centered on the board.
  x -= centreX;
  y -= centreY;
  let theta = Math.atan2(y, parseFloat(x));

  //mapping angle to number on dartboard.
  let section = (Math.round(10 * theta / Math.PI) +10) % 20; //20 sections in total [0-19]
  let result = dartboardOrder[section];

  let r2= x*x + y*y;

  //Checking for misses, bonuses, and bulls.
  if (r2 < radii[1]) {
    console.log(50);
    result = 50;
  } else if (r2< radii[2]) {
    result = 25;
    console.log(25);
  } else if (r2< radii[3]) {
    console.log("normal");
  } else if (r2< radii[4]) {
    console.log("triple");
    result*=3;
  } else if (r2< radii[5]) {
    console.log("normal");
  } else if (r2< radii[6]) {
    console.log("double");
    result*=2;
  } else {
    console.log("nuttin");
    result = 0;
  }
  console.log("Final result: ", result);

  return result;
}

//Approximates a bell curve with mean 0 and max/min of 1/-1
function nextNormal() {
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

/*
Calculate the variance introduced by human error.
Assume that the shooter can hit the board, and that the dart lands within 0.5 board lengths of the throw.
returns an array of [xOffset, yOffset]
*/
function getHumanError() {
  let theta = ((Math.random()-0.5) * Math.PI * 2);
  let distance = nextNormal() * canvas.height *0.75;
  return [distance * Math.cos(theta), distance * Math.sin(theta)];
}

//Simulate throwing a dart
function throwDart(event){
  for (let reaction of reactions) {
    reaction.visible = false;
  }

  //If there are already three darts on the screen, we need to remove them.
  if (currentDart >= 3) {
    for (let dart of darts) {
      dart.visible = false;
    }
    currentDart = 0;
    score = 0;
    udpdateScore();
  }

  //Throw the next valid dart
  darts[currentDart].visible = true;

  let offsets = getHumanError();

  darts[currentDart].x = event.rawX + offsets[0];
  darts[currentDart].y = event.rawY + offsets[1];
  //throwDart.gotoAndStop("throw");
  let thisthrow = evaluatePoints(darts[currentDart].x, darts[currentDart].y);
  if (thisthrow < 2) {
    reactions[0].visible = true;
  } else if ( thisthrow < 15) {
    reactions[1].visible = true;
  } else if (thisthrow < 50) {
    reactions[2].visible = true;
  } else {
    reactions[3].visible = true;
  }
  score += thisthrow;

  darts[currentDart].gotoAndPlay("throw");


  currentDart++;
}

function udpdateScore() {
  scoreDisplay.text = "Score: " + score;
}

/*
Loading screen functions.
*/
//Adjust position of image, difficult to centre vertically with pure css
function adjustLoadingScreen() {
  let img = document.getElementById("splashimg");
  img.style.marginTop = canvas.height/2 - img.height/2 + "px";
  console.log(canvas.height/2 - img.height/2 + "px");
}

function hideLoadingScreen() {
  let div = document.getElementById("splash");
  div.style.display = "none";
}


//Just initialzes the reactions array with the four available reactions
function loadReactions() {

  reactions.push(new createjs.Sprite(new createjs.SpriteSheet({
    images: [loader.getResult("fail")],
    frames: {width:125, height:66},
    animations: {
      display:{
        speed: 0.4,
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]
      }
    }
  }), "display"));

  reactions.push(new createjs.Sprite(new createjs.SpriteSheet({
    images: [loader.getResult("uhhh")],
    frames: {width:208, height:72},
    animations: {
      display:{
        speed: 0.4,
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]
      }
    }
  }), "display"));

  reactions.push(new createjs.Sprite(new createjs.SpriteSheet({
    images: [loader.getResult("noice")],
    frames: {width:190, height:67},
    animations: {
      display:{
        speed: 0.4,
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]
      }
    }
  }), "display"));

  reactions.push(new createjs.Sprite(new createjs.SpriteSheet({
    images: [loader.getResult("2clutch")],
    frames: {width:243, height:67},
    animations: {
      display:{
        speed: 0.4,
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]
      }
    }
  }), "display"));

  for (let reaction of reactions) {
    reaction.x = canvas.width /2 - reaction.getBounds().width*1.5 /2;
    reaction.y = canvas.height - 120;
    reaction.visible = false;
    reaction.scaleX = 1.5;
    reaction.scaleY = 1.5;
  }
}
