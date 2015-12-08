import * as mov from "./movement";

window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let enemySprite = new Image();
  enemySprite.onload = () => {
    drawBackground();
    gameLoop();
  };
  enemySprite.src = "sprite.svg";

  let enemies = [];

  let mapData = [];
  let counter = 0;
  let fps = 60;
  const wurzel2 = Math.sqrt(2);
  const pi = Math.PI;

  let horst = {x: 0, y: 0, mapSeg: 0, speed: 0.8, k: 0, type: 0, orientation: 0, radius: 15}; // speed in pixel per frame
  let erna = {x: 0, y: 0, mapSeg: 0, speed: 1, k: 0, type: 1, orientation: 0, radius: 20}; // speed in pixel per frame
  // orientation: 0 - nach unten, 1 - nach oben, 2 - nach rechts, 3 - nach links
  enemies.push(horst, erna);

  const map0 = {
    type: "line",
    dVector: [250, 250],
    length: wurzel2 * 250
  };

  const map1 = {
    type: "circle",
    center: [200, 300],
    radius: wurzel2 * 50,
    shift: 0.125,
    factor: 1,
    length: 100 * wurzel2 * pi,
    direction: 1
  };

  const map2 = map0;

  const map3 = {
    type: "circle",
    center: [575, 425],
    radius: wurzel2 * 75,
    shift: 0.375,
    factor: 2,
    length: 75 * wurzel2 * pi,
    direction: -1
  };

  const map4 = {
    type: "line",
    dVector: [-150, -150],
    length: wurzel2 * 150
  };

  const map5 = {
    type: "circle",
    center: [550, 150],
    radius: wurzel2 * 50,
    shift: 0.625,
    factor: 8 / 3,
    length: 37.5 * wurzel2 * pi,
    direction: 1
  };

  const map6 = {
    type: "line",
    dVector: [250, 0],
    length: 250
  };


  mapData.push(map0, map1, map2, map3, map4, map5, map6);

  function drawBackground () {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 600);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 500);
    ctx.moveTo(650, 350);
    ctx.lineTo(500, 200);
    ctx.moveTo(550, 150 - 50 * wurzel2);
    ctx.lineTo(800, 150 - 50 * wurzel2);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(575, 425, 75 * wurzel2, -0.25 * pi, 0.75 * pi);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(550, 150, 50 * wurzel2, 0.75 * pi, 1.5 * pi);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(200, 300, 50 * wurzel2, 0, 2 * pi);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

  }

  function drawEnemy(enemy) {
    let {x: x, y: y, type: t, orientation: o, radius: r} = enemy;
    ctx.drawImage(enemySprite, o * 60, t * 60, 50, 50, x - r, y - r, 2 * r, 2 * r);
  }

  function gameLoop () {

    if (enemies.length > 0) {
        setTimeout(() => {
          gameLoop();
        }, fps / 1000);
    }

    counter += 1;
    let deadEnemies = [];
    drawBackground();
    enemies.forEach((e, i) => {
      let {oldX, oldY} = mov.moveToNextPosition(e, i, mapData, deadEnemies);
      mov.calcOrientation(e, oldX, oldY);
                            });
    if (deadEnemies.length > 0) {
      mov.deleteEnemies(enemies, deadEnemies);
    }
    enemies.forEach(drawEnemy);
  }



};
