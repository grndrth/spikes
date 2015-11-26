import * as mov from "./movement";
import * as shoot from "./shooting";
require("babel-polyfill");

window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let enemies = [];

  let mapData = [];
  let fps = 60;
  const wurzel2 = Math.sqrt(2);
  const pi = Math.PI;

  let horst = {x: 0, y: 0, mapSeg: 0, speed: 0.6, k: 0, color: "blue"}; // speed in pixel per frame
  let marlene = {x: 0, y: 0, mapSeg: 0, speed: 0.8, k: 0, color: "green"}; // speed in pixel per frame
  let markus = {x: 0, y: 0, mapSeg: 0, speed: 0.4, k: 0, color: "red"}; // speed in pixel per frame
  enemies.push(horst, marlene, markus);

  const map0 = {
    type: "line",
    dVector: [800, 600],
    length: 1000
  };
  mapData.push(map0);

  const towers = [
    {
      x: 130,
      y: 200,
      radius: 30,
      range: 150,
      target: -1,
      activeIn: 0
    },
    {
      x: 400,
      y: 150,
      radius: 30,
      range: 150,
      target: -1,
      activeIn: 1000
    },
    {
      x: 600,
      y: 550,
      radius: 30,
      range: 150,
      target: -1,
      activeIn: 0
    }
  ];

  function drawBackground () {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 600);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(800, 600);
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 30;
    ctx.stroke();
    ctx.closePath();
    towers.forEach(drawTower);
  }

  function drawTower(tower) {
    let {x: x, y: y, radius: r1, range: r2, target: target, activeIn: ready} = tower;
    let towerColor = "olive";
    let rangeColor = "olive";
    if (target >= 0) {
      rangeColor = "red";
    }
    if (ready) {
      towerColor = "yellow";
    }
    ctx.beginPath();
    ctx.arc(x, y, r1, 0, 2 * pi);
    ctx.fillStyle = towerColor;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x, y, r2, 0, 2 * pi);
    ctx.strokeStyle = rangeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
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
    enemies.forEach((e, i) => {
      mov.moveToNextPosition(e, i, mapData, deadEnemies);
    });

    let sleepingTowers = towers.filter((tower) => {
      return tower.activeIn;
    });
    sleepingTowers.forEach((tower) => {
      tower.activeIn -= 1;
    });

    let activeTowers = towers.filter((tower) => {
      return !tower.activeIn;
    });

    activeTowers.forEach((tower) => {
      tower.target = shoot.checkEnemyinRange(tower, enemies);
    });

    let shootingTowers = activeTowers.filter((tower) => {
      return tower.target >= 0;
    });

    shootingTowers.forEach((tower) => {
      let target = tower.target;
      deadEnemies.push(target);
      tower.activeIn = 1000;
      tower.target = -1;
    });

    if (deadEnemies.length > 0) {
      mov.deleteEnemies(enemies, deadEnemies);
    }
    enemies.forEach(drawCircle);
  }

  drawBackground();
  gameLoop();

};
