/* Infinitive car racing game . Reach the highest score possible and be 
careful not to touch the obstacles such as the cones and dodge them using your 
left and right arrow keys. Also do not loose all lives 
or else you will die.If you wanna go faster collect the power boosters and 
increase your speed for a challenge.You can collect fuel canisters if you are about
to run out of fuel on your way.

*/



var ground;
var trackImage;
var car,carImage;

var obstaclesGroup,speedBumpImage;
var coneImg,conesGroup;


const life = 3;
var currentLife = 3;

const START = 0
const PLAY = 1
const END = 2
var gameState = PLAY;

var livesImg,livesGroup;
var gameOverImg,gameOver;
var restartImg, restart;

var boostersImg,boostersGroup;

var  trackLeft = 270;
var  trackRight = 500;

var score = 0;

var jumpSound , checkPointSound, dieSound;


function preload(){
  trackImage=loadImage("assets/track2.png");
  carImage=loadImage("assets/sf90car.png");
  speedBumpImage=loadImage("assets/speedBump.png")
  coneImg=loadImage("assets/cone.png")
  gameOverImg=loadImage("assets/gameOver1.png")
  restartImg=loadImage("assets/restart1.png")
  livesImg=loadImage("assets/live.png")
  boostersImg=loadImage("assets/booster.png")

  jumpSound = loadSound("assets/jump.mp3")
  dieSound = loadSound("assets/die.mp3")
  checkPointSound = loadSound("assets/checkPoint.mp3")


}

function setup(){
  createCanvas(windowWidth,windowHeight);ground = createSprite(200,180,400,20);
  
  trackRight= width/2-100;
  
  //ground = createSprite(200,180,400,20);
  ground = createSprite(windowWidth/2,windowHeight/2,100,100);
  ground.addImage("track2",trackImage);
  //ground.x = ground.width /2;
  ground.scale=2.5;
  ground.velocityY=2;

  car=createSprite(width/4,height/2,40,40);
  car.addImage("sf90car",carImage);

  obstaclesGroup=new Group();
  conesGroup=new Group();
  boostersGroup=new Group();

  livesGroup = new Group();

  for (var i = 0;i<currentLife;i++){
    var heart = createSprite(displayWidth-(currentLife-i)*80,40,20,20);
    heart.addImage(livesImg);
    heart.scale = 0.2;
    livesGroup.add(heart);
  }

  restart = createSprite(windowWidth/2 - 20,windowHeight/2 + 200,20,20);
  restart.addImage(restartImg);
  restart.visible = false;
  restart.scale = 0.5;

  gameOver = createSprite(windowWidth/2 -20,windowHeight/2 - 100,20,20);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  gameOver.scale = 0.7;

}

function draw(){
  background("blue");

  if (ground.y>400)
    ground.y= height/2

  if (gameState == PLAY)    {
      handlePlayerControls();
      spawnObstacles();
      spawnCones();
      spawnBoosters();
      conesGroup.overlap (car,handleObstacleCollision);
      boostersGroup.overlap (car,handleBoosterSpeed);
    
      score = score + Math.round(getFrameRate()/60);
  }


if (gameState == END) {
  restart.visible=true;
  ground.velocityY=0;
  if (mousePressedOver(restart)){
    reset();
  }
  obstaclesGroup.setLifetimeEach(-1);
  conesGroup.setLifetimeEach(-1);
  boostersGroup.setLifetimeEach(-1);

  obstaclesGroup.setVelocityYEach(0);
  conesGroup.setVelocityYEach(0);
  boostersGroup.setVelocityYEach(0);

  obstaclesGroup.destroyEach();
  conesGroup.destroyEach();
  boostersGroup.destroyEach();

 
  

}

  drawSprites();
  displayScore();
}

function displayScore(){
  textSize(30);
  fill("red");
  text("Score : "+score,20,150)
}
function reset () {
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  currentLife=life;
  obstaclesGroup.destroyEach();
  conesGroup.destroyEach();
  boostersGroup.destroyEach();
  ground.velocityY=2;
  score=0;
  for (var i = 0;i<currentLife;i++){
    var heart = createSprite(displayWidth-(currentLife-i)*80,40,20,20);
    heart.addImage(livesImg);
    heart.scale = 0.2;
    livesGroup.add(heart);
  }

}

function handlePlayerControls(){
  if(keyDown(LEFT_ARROW)){
    if(car.position.x>trackLeft){
      car.position.x-=5;
    }

    
  }
  
  if(keyDown(RIGHT_ARROW)){
    if(car.position.x<trackRight){
      car.position.x+=5;
    }

}
}
function spawnObstacles(){
  if (frameCount % 500 == 0) {
      var obstacle;
      obstacle=createSprite(width/3-50,100,50,40)
      obstacle.addImage("speedBump",speedBumpImage);
      obstacle.scale=0.6;
      obstacle.velocityY=2;
      obstaclesGroup.add(obstacle);
      car.depth=obstacle.depth+1;
      obstacle.lifetime=300

  }
}

function spawnCones(){
  if (frameCount % 250 == 0) {
      var obstacle;
      obstacle=createSprite(random (trackLeft+75, trackRight-50),-10,50,40)
      obstacle.addImage("cone",coneImg);
      obstacle.scale=0.6;
      obstacle.velocityY=2;
      conesGroup.add(obstacle);
      car.depth=obstacle.depth+1;
      obstacle.lifetime=300

  }
}
function spawnBoosters(){
  if (frameCount % 555 == 0) {
      var obstacle;
      obstacle=createSprite(random(trackLeft+75, trackRight-50),-10,50,40)
      obstacle.addImage("booster",boostersImg);
      obstacle.scale=0.5;
      obstacle.velocityY=2;
      boostersGroup.add(obstacle);
      car.depth=obstacle.depth+1;
      obstacle.lifetime=300

  }
}

function handleObstacleCollision (cone, car) {
  console.log (currentLife);
  if (currentLife>0){
    currentLife-=1
    livesGroup[currentLife].destroy();
    dieSound.play();
  }
  cone.destroy();
  if (currentLife<=0){
    gameOver.visible=true;
    gameState=END;
  }
  
}
function handleBoosterSpeed(booster,car){
  booster.destroy();
  ground.velocityY+=3;
  checkPointSound.play();
}

