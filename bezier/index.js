import * as mov from "./movement";

window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let img = new Image();
  img.onload = drawBackground;
  img.src = "einfacherweg.png";

  let enemies = [];
  let mapData = [];
  let counter = 0;
  let fps = 60;

  let horst = {x: 800, y: 500, mapSeg: 2, speed: -0.8, k: 1, color: "blue"}; // speed in pixel per frame
  let erna = {x: 100, y: 0, mapSeg: 0, speed: 0.8, k: 0, color: "green"}; // speed in pixel per frame
  enemies.push(erna, horst);

  const line1 = {
    "type": "line",
    "dVector": [0, 250],
    "length": 250};

  const circle = {
    "type": "circle",
    "center": [350, 250],
    "radius": 250,
    "shift": 0.5,
    "factor": 4,
    "length": (125 * Math.PI)};

    const line2 = {
      "type": "line",
      "dVector": [450, 0],
      "length": 450};


  mapData.push(line1, circle, line2);

  function drawBackground () {
    ctx.drawImage(img, 0, 0, 800, 600);
  }

  function drawCircle (enemy) {
    let {x: x, y: y, color: color} = enemy;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function gameLoop () {

    if (counter < 1500) {
        setTimeout(() => {
          gameLoop();
        }, fps / 1000);
    }

    counter += 1;
    drawBackground();
    enemies.forEach((e) => {mov.moveToNextPosition(e, mapData);
                            });
    enemies.forEach(drawCircle);
  }

  gameLoop();

};
