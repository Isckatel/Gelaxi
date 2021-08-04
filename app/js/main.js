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
}

class Bug extends Unit {
  speedBug = 0.3;
  trendBug = 1; //1-направелние вправо 0-направелине движения влево
  dead = false;
  bufX = this.x; //для расчета медленного передвижения
}

class Bullet extends Unit {
  speedBull = 3;
}

let buggreens = [];
const gapbug = 5;
for (let i=0; i<10; i++) {
  if (i==0) buggreens[i] = new Bug("img/buggreen.png",50,37);
  else buggreens[i] = new Bug("img/buggreen.png", buggreens[i-1].x+16+gapbug, 37);
}

let buggreens2 = [];
for (let i=0; i<10; i++) {
  if (i==0) buggreens2[i] = new Bug("img/buggreen.png",50,52);
  else buggreens2[i] = new Bug("img/buggreen.png", buggreens2[i-1].x+16+gapbug, 52);
}
console.log(buggreens);
console.log(buggreens2);
let player = new Unit("img/player.png",142,220);
let bulPlay = new Unit("img/bullet.png",-16, -16, 8, 8);

const speedPlayer = 7;
const speedBull = 2;
let bullShot = false;

let countDed = 0;
let endGame = false;

//Загрузилась ли последния картинка?
//Вызываем основную функцию
player.img.onload= draw; //draw();

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

//Измениения  в игре
function update() {
  movBugs(buggreens);
  movBugs(buggreens2);
  movBullet();

  collisionEnemy(buggreens);//Попадание во врога
  collisionEnemy(buggreens2);//Попадание во врога
  countDeds();//Подсчет мертвых жуков
}

//Основная функция
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 320, 240); // Заливка

  update();

  bulPlay.draw();
  for(let i=0;i<buggreens.length;i++){
    buggreens[i].draw();
  }
  for(let i=0;i<buggreens2.length;i++){
    buggreens2[i].draw();
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
function movBugs(buggreens) {
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

//Попадание во врога
function collisionEnemy(buggreens) {
  for(let i=0;i<buggreens.length;i++){
    if (collision(bulPlay,buggreens[i]) ) {
        bulPlay.y = -16;
        bulPlay.x = -16;
        bullShot = false;
        buggreens[i].y = 260;
        buggreens[i].dead = true;
      }
  }
}
//Подсчет мертвых жуков
function countDeds() {
  countDed = 0;
  for(let i=0;i<buggreens.length;i++) {
    if (buggreens[i].dead) countDed+=1;
    if (buggreens2[i].dead) countDed+=1;
  }
  if (countDed == (buggreens.length+buggreens2.length)) endGame = true;
}
