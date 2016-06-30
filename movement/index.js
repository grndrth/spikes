import * as mov from "./movement";
import { map } from "./map0";

window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let background = new Image();
  background.onload = () => {
    drawBackground();
    gameLoop();
  };

  background.src = "map0.png";

  let enemies = [];

  let mapData = map;
  let fps = 60;

  let horst = {x: 100, y: 0, mapSeg: 0, speed: 1, k: 0, color: "yellow"}; // speed in pixel per frame
  let erna = {x: 200, y: 600, mapSeg: 12, speed: -0.8, k: 1, color: "red"}; // speed in pixel per frame
  enemies.push(horst, erna);


  function drawBackground () {
    ctx.drawImage(background, 0, 0);
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

    if (enemies.length > 0) {
        setTimeout(() => {
          gameLoop();
        }, fps / 1000);
    }

    let deadEnemies = [];
    drawBackground();
    enemies.forEach((e, i) => {mov.moveToNextPosition(e, i, mapData, deadEnemies);
                            });
    if (deadEnemies.length > 0) {
      mov.deleteEnemies(enemies, deadEnemies);
    }
    enemies.forEach(drawCircle);
  }

};
