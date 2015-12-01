import * as mov from "./movement";
import * as shoot from "./shooting";

require("babel-polyfill");

window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let enemies = [];
  let mapData = [];
  let impactAreas = [];
  let fps = 60;
  // const wurzel2 = Math.sqrt(2);
  const pi = Math.PI;
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
      targetIndex: -1,
      activeIn: 0,
      shootDuration: 60,
      reload: 250,
      damage: 6,
      splash: 40
    },
    {
      x: 400,
      y: 150,
      radius: 30,
      range: 150,
      target: -1,
      targetIndex: -1,
      activeIn: 500,
      shootDuration: 60,
      reload: 250,
      damage: 6,
      splash: 50
    },
    {
      x: 600,
      y: 550,
      radius: 30,
      range: 150,
      target: -1,
      targetIndex: -1,
      activeIn: 0,
      shootDuration: 60,
      reload: 250,
      damage: 6,
      splash: 30
    }
  ];

  let feind1 = {id: 1, x: 0, y: 0, mapSeg: 0, speed: 0.9, k: 0, color: "green", hit: 10, strength: 10}; // speed in pixel per frame
  let feind2 = {id: 2, x: 0, y: 0, mapSeg: 0, speed: 0.8, k: 0, color: "blue", hit: 10, strength: 10}; // speed in pixel per frame
  let feind3 = {id: 3, x: 0, y: 0, mapSeg: 0, speed: 0.7, k: 0, color: "red", hit: 10, strength: 10}; // speed in pixel per frame
  let feind4 = {id: 4, x: 0, y: 0, mapSeg: 0, speed: 0.6, k: 0, color: "green", hit: 10, strength: 10}; // speed in pixel per frame
  let feind5 = {id: 5, x: 0, y: 0, mapSeg: 0, speed: 0.5, k: 0, color: "blue", hit: 10, strength: 10}; // speed in pixel per frame
  let feind6 = {id: 6, x: 0, y: 0, mapSeg: 0, speed: 0.4, k: 0, color: "red", hit: 10, strength: 10}; // speed in pixel per frame
  enemies.push(feind1, feind2, feind3, feind4, feind5, feind6);

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

  }

  function drawTower(tower) {
    let {x: x, y: y, radius: r1, range: r2, target: target, activeIn: ready} = tower;
    let towerColor = "olive";
    let rangeColor = "olive";
    if (target >= 0) {
      rangeColor = "red";
      // drawShoot(tower);
    }
    if (ready > 0) {
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
    let radius = 10;
    let {x: x, y: y, color: color, hit: hit, strength: strength, speed: speed} = enemy;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    if (speed > 0) {
        let life = hit / strength;
        ctx.fillStyle = "red";
        ctx.fillRect(x - radius, y - 2 * radius, 2 * radius, 0.5 * radius);
        ctx.fillStyle = "green";
        ctx.fillRect(x - radius, y - 2 * radius, 2 * radius * life, 0.5 * radius);
      }
  }

  function drawImpact(area) {
    let {x: x, y: y, radius: r} = area;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * pi);
    ctx.fillStyle = "rgba(250, 175, 100, 0.75)";
    ctx.fill();
    ctx.closePath();
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
      if(e.hit <= 0) {
        e.speed = -0.1;
        e.color = "white";
      }
      mov.moveToNextPosition(e, i, mapData, deadEnemies);
    });

    let sleepingTowers = towers.filter((tower) => {
      return tower.activeIn > 0;
    });

    let readyTowers = towers.filter((tower) => {
      return tower.activeIn === 0 && tower.target === -1;
    });

    let reloadingTowers = towers.filter((tower) => {
      return tower.activeIn <= -tower.shootDuration;
    });

    let shootingTowers = towers.filter((tower) => {
      return tower.target >= 0;
    });

    sleepingTowers.forEach((tower) => {
      tower.activeIn -= 1;
    });

    reloadingTowers.forEach((tower) => {
      let index = enemies.findIndex((enemy) => {
        return enemy.id === tower.target;
      });
      tower.targetIndex = index;
      let hitEnemy = enemies[index];
      impactAreas.push({x: hitEnemy.x, y: hitEnemy.y, frames: 60, radius: tower.splash, damage: tower.damage});

      tower.activeIn = tower.reload;
      tower.target = -1;
    });

    shootingTowers.forEach((tower) => {
      tower.activeIn -= 1;
    });

    readyTowers.forEach((tower) => {
      let targetIndex = shoot.checkEnemyinRange(tower, enemies);
      if (targetIndex >= 0) {
        tower.target = enemies[targetIndex].id;
      } else {
        tower.target = -1;
      }
      tower.targetIndex = targetIndex;
    });

    towers.forEach(drawTower);

    let activeImpactAreas = impactAreas.filter((area) => {
      return area.frames === 60;
    });



    impactAreas.forEach((area) => {
      area.frames -= 1;
      if (area.frames > 0) {
        drawImpact(area);
      }
    });

    enemies.forEach((enemy) => {
      activeImpactAreas.forEach((area) => {
        let impact = shoot.checkImpact(enemy, area);
        if (impact) {
          enemy.hit -= area.damage;
        }
      });
    });

    if (deadEnemies.length > 0) {
      mov.deleteEnemies(enemies, deadEnemies);
    }
    enemies.forEach(drawCircle);
  }


  drawBackground();
  gameLoop();

};
