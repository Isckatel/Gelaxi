console.log('Скрипты подключены!');
var cvs = document.getElementById("canvas");
if (cvs.getContext){
  var ctx = canvas.getContext('2d');
} else {
  alert("Ваш браузер не поддерживает тег canvas. Обновите браузер.");
}

class Unit {
  constructor(srsImg, x = -16, y = -16) {
    this.img = new Image();
    this.img.src = srsImg;
    this.x = x;
    this.y = y;
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y);
  }

}

let buggreen = new Unit("img/buggreen.png",142,16);
let player = new Unit("img/player.png",142,220);
let bulPlay = new Unit("img/bullet.png");

const speedPlayer = 7;
const speedBug = 0.3;
const speedBull = 2;

let bullShot = false;
let trendBug = 1; //1-направелние вправо 0-направелине движения влево
let bufPosX = buggreen.x;
// //Трубы
// let pipes = [{x:cvs.width, y:0}];
//
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

      break;

    case "Space":

      break;
  }
})


//Основная функция
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 320, 240); // Заливка

  movBug();
   if (bullShot) {bulPlay.y-=speedBull;}
  // if (bulPlay.y>=-8) {
  //   bulPlay.y=-16;
  //   bulPlay.x=-16;
  //   bullShot=false;
  // }

  player.draw();
  buggreen.draw();
  bulPlay.draw();
  requestAnimationFrame(draw); // Вызов функции постоянно для перерасчета перед обновлением кадра
}

function movBug() {
  if (trendBug==1) {
    bufPosX = bufPosX + speedBug;
    buggreen.x = Math.round(bufPosX);
  } else {
    bufPosX = bufPosX - speedBug;
    buggreen.x = Math.round(bufPosX);
  }
  if (buggreen.x>302) {trendBug =2;}
  else if (buggreen.x<2) {trendBug =1;}
}
