window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let canvasSmoke = document.getElementById("canvas-smoke");
  let ctxs = canvasSmoke.getContext("2d");
  let towerImg = new Image();
  let qualm = new Image();
  towerImg.onload = () => {
    qualm.onload = start;
    qualm.src = "qualm.png";
  };
  towerImg.src = "tower.png";
  let enemy1 = {x: 100, y: 500, radius: 15};
  let enemy2 = {x: -100, y: 500, radius: 15};
  let tower1 = {x: 500, y: 200, radius: 25};
  let factor = 2;
  let targetFactor = 0;
  let counter = 0;
  let status = 0; //idle, 1: shooting, 2: reloading
  let enemyFactor = 0;

  function animationLoop() {
      if(counter <= 800) {
        window.requestAnimationFrame(animationLoop);
      }
      ctxs.globalAlpha = 1;
      ctx.clearRect(0, 0, 800, 600);
      ctxs.clearRect(0, 0, 800, 600);

      drawEnemy(enemy1, ctx);
      drawEnemy(enemy2, ctx);

      if (counter > 120 && counter <= 400) {
        status = 1;
      } else if (counter > 300 && counter <= 550) {
        status = 2;
      } else {
        status = 0;
      }

      switch (status) {
        case 0:
            drawIdleTower(tower1, ctx, towerImg, 0, enemy1);
          break;
        case 1:
          let smoke = calcSmokeTargetVector(enemy1, tower1, factor, targetFactor);
          let {startX, startY} = calcStartingPoint(smoke, tower1);
          let startingAngle = calcStartingAngle(smoke, tower1, startX);
          if(targetFactor < 1) {
            targetFactor += 1/60;
          } else {
            targetFactor = 1;
          }
            drawRotatingTower(tower1, ctx, towerImg, status, startingAngle);
            drawSmoke(enemy1, tower1, factor, targetFactor, smoke, startX, startY, startingAngle, ctxs);
            drawChainSmoke(enemy1, enemy2, ctxs, qualm);
          break;
        case 2:
            drawIdleTower(tower1, ctx, towerImg, 0, enemy1);
            break;
        default:

      }

      enemy1.x += 1;
      enemy2.x += 1;
      enemy1.y -= 0;
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

  function calcSmokeTargetVector(enemy, tower, factor, targetFactor) {
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

  function drawIdleTower(tower, ctx, img, status) {
    ctx.drawImage(img, 0, status * 70, 60, 60, tower.x - tower.radius, tower.y - tower.radius, 2 * tower.radius, 2 * tower.radius);
  }

  function drawRotatingTower(tower, ctx, img, status, startingAngle) {
      ctx.save();
      ctx.translate(tower.x, tower.y);
      ctx.rotate(startingAngle - Math.PI);
      ctx.drawImage(img, 0, status * 70, 60, 60, -tower.radius , -tower.radius, 2 * tower.radius, 2 * tower.radius);
      ctx.restore();
  }

  function drawSmoke(enemy, tower, factor, targetFactor, smoke, startX, startY, startingAngle, ctx) {


    // let endAngle = startingAngle + Math.PI;

    // ctx.save();
    // ctx.beginPath();
    // ctx.moveTo(tower.x, tower.y);
    // ctx.lineTo(startX, startY);
    // ctx.arc(smoke.x, smoke.y, smoke.radius, startingAngle, endAngle, false);
    // ctx.lineTo(tower.x, tower.y);
    // ctx.closePath();
    // ctx.clip();
    // ctx.drawImage(qualm, 0, 0, 800, 600);
    // ctx.restore();
  }

  function drawChainSmoke(enemy, target, ctx, img) {
    // let {x: x, y: y, radius: r} = target;
    // let {px1, px2, px3, px4, py1, py2, py3, py4} = calcRectPoints(enemy, target);
    let points = calcRectPoints(enemy, target);
    // let points = {px1: 100, px2: 400, px3: 400, px4: 100, py1: 100, py2: 100, py3: 200, py4: 200};
    // let target1 = {x: 110, y: 120, radius: 50};
    drawComp(img, ctx, points, target);
  }

  function drawComp(img, ctx, points, target) {
    let {x: x, y: y, radius: r} = target;
    let {px1, px2, px3, px4, py1, py2, py3, py4} = points;

    ctx.drawImage(img ,0, 0, 800, 600);
    ctx.globalCompositeOperation='destination-in';
    ctx.beginPath();
    ctx.moveTo(px3, py3);
    ctx.lineTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.lineTo(px4, py4);
    // ctx.closePath();
    // ctx.moveTo(px1, py1);
    // ctx.lineTo(px2, py2);
    // ctx.lineTo(px3, py3);
    // ctx.lineTo(px4, py4);
    ctx.arc(x, y, r * 1.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation='source-over';
  }

  function calcRectPoints(enemy, target) {
    let {x: x1, y: y1} = enemy;
    let {x: x2, y: y2, radius: r2} = target;

    let deltaX = - (y1 - y2);
    let deltaY = - (x1 - x2);
    let width = r2 / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    let px1 = Math.floor(x1 - 0.5 * width * deltaX);
    let px2 = Math.floor(x1 + 0.5 * width * deltaX);
    let px3 = Math.floor(x2 - 0.5 * width * deltaX);
    let px4 = Math.floor(x2 + 0.5 * width * deltaX);
    let py1 = Math.floor(y1 - 0.5 * width * deltaY);
    let py2 = Math.floor(y1 + 0.5 * width * deltaY);
    let py3 = Math.floor(y2 - 0.5 * width * deltaY);
    let py4 = Math.floor(y2 + 0.5 * width * deltaY);
    return {px1, px2, px3, px4, py1, py2, py3, py4};
  }

  function start() {
    animationLoop();
  }

};


// // draw all rects with strokes
// ctx.beginPath();
// ctx.moveTo(10, 10);
// ctx.lineTo(60, 10);
// ctx.lineTo(60, 60);
// ctx.lineTo(10, 60);
// ctx.lineTo(10, 10);
// ctx.closePath();
// ctx.arc(60, 60, 20, 0, 2 * Math.PI);
// ctx.stroke();
//
// // set compositing to erase existing drawings
// // where the new drawings are drawn
// ctx.globalCompositeOperation='destination-out';
//
// // fill all rects
// // This "erases" all but the outline stroke
// ctx.beginPath();
// ctx.moveTo(10, 10);
// ctx.lineTo(60, 10);
// ctx.lineTo(60, 60);
// ctx.lineTo(10, 60);
// ctx.lineTo(10, 10);
// ctx.closePath();
// ctx.arc(60, 60, 20, 0, 2 * Math.PI);
// ctx.fillStyle = "black"
// ctx.fill();
