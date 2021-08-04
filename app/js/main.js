console.log('Скрипты подключены!');
var cvs = document.getElementById("canvas");
if (cvs.getContext){
  var ctx = canvas.getContext('2d');
} else {
  alert("Ваш браузер не поддерживает тег canvas. Обновите браузер.");
}

class Unit {
  constructor(srsImg, x = -16, y = -16, width = 16, height=16) {
    this.img = new Image();
    this.img.src = srsImg;
    this.width = width;
    this.height = width;
    this.x = x;
    this.y = y;
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y);
  }
  static getX() {return this.x}
}

class Bug extends Unit {
  speedBug = 0.3;
  trendBug = 1; //1-направелние вправо 0-направелине движения влево
  dead = false;
  bufX = this.x; //для расчета медленного передвижения
}

let buggreen = new Bug("img/buggreen.png",142,16);
let buggreens = [];
const gapbug = 5;
for (let i=0; i<10; i++) {
  if (i==0) buggreens[i] = new Bug("img/buggreen.png",50,37);
  else buggreens[i] = new Bug("img/buggreen.png", buggreens[i-1].x+16+gapbug, 37);
}

let player = new Unit("img/player.png",142,220);
let bulPlay = new Unit("img/bullet.png",-16, -16, 8, 8);

const speedPlayer = 7;
const speedBull = 2;

let endGame = false;
let bullShot = false;
let trendBug = 1; //1-направелние вправо 0-направелине движения влево
let bufPosX = buggreen.x;

//Загрузилась ли последния картинка?
//Вызываем основную функцию
player.img.onload= draw;
//draw();


document.addEventListener("keydown",(e)=>{
  let code = e.code;
  console.log(code);
  switch(code) {
    case "KeyD":
      if (player.x<302) player.x += speedPlayer;
      break;
    case "ArrowRight":
      if (player.x<302) player.x += speedPlayer; ;
      break;
    case "KeyA":
      if (player.x>2) player.x -= speedPlayer;
      break;
    case "ArrowLeft":
      if (player.x>2) player.x -= speedPlayer;
      break;
    case "KeyW":
      if (bulPlay.x == -16  && !bullShot) {
        bulPlay.x=player.x+4;
        bulPlay.y = player.y-8;
        bullShot=true;
      }
      break;
    case "ArrowUp":
      if (bulPlay.x == -16  && !bullShot) {
        bulPlay.x=player.x+4;
        bulPlay.y = player.y-8;
        bullShot=true;
      }
      break;
    case "Space":
      if (bulPlay.x == -16  && !bullShot) {
        bulPlay.x=player.x+4;
        bulPlay.y = player.y-8;
        bullShot=true;
      }
      break;
  }
})


//Основная функция
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 320, 240); // Заливка

  movBug();
  movBugs();
  movBullet();

//Попадание во врога
  if (collision(bulPlay,buggreen)) {
      bulPlay.y = -16;
      bulPlay.x = -16;
      bullShot = false;
      buggreen.y = 260;
    }
  let countDed=0;
  for(let i=0;i<buggreens.length;i++){
    if (collision(bulPlay,buggreens[i])) {
        bulPlay.y = -16;
        bulPlay.x = -16;
        bullShot = false;
        buggreens[i].y = 260;
        buggreens[i].dead = true;
      }
    if (buggreens[i].dead) countDed+=1;
  }
  if (countDed==buggreens.length) endGame = true;

  bulPlay.draw();
  buggreen.draw();
  for(let i=0;i<buggreens.length;i++){
    buggreens[i].draw();
  }
  player.draw();

  if (endGame) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px Verdana";
    ctx.fillText("Конец", 110, 110);
    removeEventListener("keydown");
  }

  if (!endGame) requestAnimationFrame(draw); // Вызов функции постоянно для перерасчета перед обновлением кадра
}
//-------------
//---ФУНКЦИИ---
//-------------
function movBug() {
  if (trendBug==1) {
    bufPosX = bufPosX + buggreen.speedBug;
    buggreen.x = Math.round(bufPosX);
  } else {
    bufPosX = bufPosX - buggreen.speedBug;
    buggreen.x = Math.round(bufPosX);
  }
  if (buggreen.x>302) {trendBug =2;}
  else if (buggreen.x<2) {trendBug =1;}
}

function movBugs() {
  for(let i=0;i<buggreens.length;i++){
    //Плавное движение из стороны в сторону
    if (buggreens[i].trendBug==1) {
      buggreens[i].bufX = buggreens[i].bufX + buggreens[i].speedBug;
      buggreens[i].x = Math.round(buggreens[i].bufX);
    } else {
      buggreens[i].bufX = buggreens[i].bufX - buggreens[i].speedBug;
      buggreens[i].x = Math.round(buggreens[i].bufX);
    }
    //границы движения жука и смена направления
    let borderRight = 302-((buggreens.length - i) * (16 + gapbug));
    let borderLeft = 2 + (i * (16 + gapbug));
    if (buggreens[i].x>borderRight) {buggreens[i].trendBug =2;}
    else if (buggreens[i].x<borderLeft) {buggreens[i].trendBug =1;}
  }
}

function movBullet() {
  if (bullShot) {bulPlay.y-=speedBull;}
  if (bulPlay.y<=-8) {
    bulPlay.y=-16;
    bulPlay.x=-16;
    bullShot=false;
  }
}

function collision(objA, objB) {
  if (objA.x+objA.width  > objB.x &&
      objA.x             < objB.x+objB.width &&
      objA.y+objA.height > objB.y &&
      objA.y             < objB.y+objB.height) {
          return true;
  } else {return false;}
}
