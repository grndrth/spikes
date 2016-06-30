window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let qualm = new Image();
  qualm.onload = start;
  qualm.src = "qualm.png";
  let enemy1 = {x: 200, y: 400, radius: 15};
  let tower1 = {x: 500, y: 500, radius: 25};
  let enemy2 = {x: 600, y: 150, radius: 15};
  let tower2 = {x: 50, y: 50, radius: 25};
  let factor = 2;
  let targetFactor = 0;
  let counter = 0;


  function animationLoop() {

      if(counter <= 400) {
        window.requestAnimationFrame(animationLoop);
      }

      ctx.clearRect(0, 0, 800, 600);
      drawTower(tower1, ctx);
      drawTower(tower2, ctx);
      drawEnemy(enemy1, ctx);
      drawEnemy(enemy2, ctx);
      drawSmoke(enemy1, tower1, factor, targetFactor);
      drawSmoke(enemy2, tower2, factor, targetFactor);

      enemy1.x += 1;
      enemy1.y -= 0.25;
      let oldX = enemy2.x;
      enemy2.x -= 1;
      enemy2.y = -0.00875 * oldX * oldX + 7 * oldX - 900;
      if(targetFactor < 1) {
        targetFactor += 1/60;
      } else {
        targetFactor = 1;
      }
      counter += 1;
  }

  function calcStartingPoint(target, tower) {
    let {x: eX, y: eY, radius: rE} = target;
    let {x: tX, y: tY} = tower;
    let deltaY = -(eX - tX);
    let deltaX = eY - tY;
    let factor = rE / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    let startX = eX + deltaX * factor;
    let startY = eY + deltaY * factor;
    return {startX, startY};
  }

  function calcStartingAngle(target, tower, startX) {
    let {x: eX, radius: rE} = target;
    let {x: tX} = tower;
    // let {startX} = start;
    let angle;
    if(eX <= tX) {
      angle = Math.PI - Math.acos((eX - startX) / rE);
    } else {
      angle = Math.PI + Math.acos((eX-startX) / rE);
    }
    return angle;
  }

  function calcSmokeTarget(enemy, tower, factor, targetFactor) {
    let {x: eX, y: eY, radius: eR} = enemy;
    let {x: tX, y: tY} = tower;
    let x = tX + targetFactor * (eX - tX);
    let y = tY + targetFactor * (eY - tY);
    let radius = eR * factor * targetFactor;
    return {x, y, radius};
  }

  function drawEnemy(enemy, ctx) {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  function drawTower(tower, ctx) {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(tower.x, tower.y, tower.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  function drawSmoke(enemy, tower, factor, targetFactor) {
    let smoke = calcSmokeTarget(enemy, tower, factor, targetFactor);
    let {startX, startY} = calcStartingPoint(smoke, tower);
    let startingAngle = calcStartingAngle(smoke, tower, startX);
    let endAngle = startingAngle + Math.PI;

    ctx.save();
    ctx.beginPath();
    // ctx.strokeStyle = "black";
    // ctx.fillStyle = `rgba(150, 150, 150, ${randOp})`;
    ctx.moveTo(tower.x, tower.y);
    ctx.lineTo(startX, startY);
    ctx.arc(smoke.x, smoke.y, smoke.radius, startingAngle, endAngle, false);
    ctx.lineTo(tower.x, tower.y);
    // ctx.stroke();
    // ctx.fill();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(qualm, 0, 0, 800, 600);
    ctx.restore();
  }

  // function calcDistance(enemy, tower) {
  //   let {x: eX, y: eY} = enemy;
  //   let {x: tX, y: tY} = tower;
  //   return Math.sqrt(Math.pow((eX - tX), 2) + Math.pow((eY - tY), 2));
  //
  // }
  function start() {
    animationLoop();
  }

};
