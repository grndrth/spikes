import { drawMap1 } from "./drawMap";
import { rand, pi, wegdicke } from "./const";

window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let bRect = canvas.getBoundingClientRect();
  let towers = [];
  let radius = 30;
  let body = document.getElementsByTagName("body")[0];
  let forbiddenZones = [
    {
      type: "line",
      start: [150, 0],
      vector: [0, 425]
    },
    {
      type: "line",
      start: [400, 425],
      vector: [0, -175]
    },
    {
      type: "line",
      start: [570.71, 179.29],
      vector: [229.29, 229.29]
    },
    {
      type: "circle",
      center: [275, 425],
      vector: [0, 125],
      angle: 0.5 * pi,
      radius: 125
    },
    {
      type: "circle",
      center: [500, 250],
      vector: [-38.27, -92.39],
      angle: 0.375 * pi,
      radius: 100
    }
  ];



  function addEventHandler() {
    canvas.addEventListener("mousedown", mouseDownHandler);
  }

  function getTowerCoords({mouseX, mouseY}) {
    let {top, left} = bRect;
    let x = mouseX - left;
    let y = mouseY - top;
    return {x, y};
  }

  function checkTowerPos({x, y}) {
    let top = y < (rand + radius) || y > (600 - rand - radius);
    let left = x < (rand + radius) || x > (800 - rand - radius);

    if (top || left) {
      return true;
    } else {
      return towers.some((e) => {
        let {x: nX, y: nY} = e;
        let distance = Math.sqrt(Math.pow((x - nX), 2) + Math.pow((y - nY), 2)) / 2;
        return distance < radius;
      });
    }
  }

  function checkMousePos({x, y}) {
    let top = y < 0 || y > canvas.height;
    let left = x < 0 || x > canvas.width;
    return top || left;
  }

  function calcPerpFoot({x, y}, r, zone) {
      let {start: [xS, yS], vector: [vX, vY]} = zone;
      let t = ((x - xS) * vX + (y - yS) * vY) / (vX * vX + vY * vY);
      if (t < 0 || t > 1) {
        return false;
      } else {
        let xP = xS + t * vX;
        let yP = yS + t * vY;
        let dist = Math.sqrt((x - xP) * (x - xP) + (y - yP) * (y - yP));
        return dist < (r + wegdicke);
      }
  }


  function checkCircleCollision({x, y}, rTower, zone) {
    let {center: [xM, yM], vector: [vX, vY], angle: a, radius: r} = zone;
    let pX = x - xM;
    let pY = y - yM;
    let length = Math.sqrt(pX * pX + pY * pY);
    let pAngle = Math.acos((pX * vX + pY * vY) / (r * length));
    if(pAngle > a) {
      return false;
    } else {
      let dist = Math.abs(r - length);
      if (dist >= wegdicke + rTower) {
        return false;
      } else {
        return true;
      }
    }
  }


  function checkCollisionZone({x, y}, r, zones) {
    return zones.some((e) => {
      let {type: type} = e;
      if (type === "line") {
        return calcPerpFoot({x, y}, r, e); }
      else if (type === "circle") {
        return checkCircleCollision({x, y}, r, e);
      }
    });
  }


  function drawBackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 600);
    drawMap1(ctx);
    towers.forEach(e => drawTower(e));
    }

  function drawTower({x, y}, color="grey") {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * pi);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x, y, 5 * radius, 0, 2 * pi);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }

  function mouseDownHandler(event) {
    body.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    let {clientX: mouseX, clientY: mouseY} = event;
    let {x, y} = getTowerCoords({mouseX, mouseY});
    let color = "grey";
    if(checkTowerPos({x, y})) {
        color = "red";
    }
      drawTower({x, y}, color);
    }

  function mouseMoveHandler(event) {
    let {clientX: mouseX, clientY: mouseY} = event;
    let {x, y} = getTowerCoords({mouseX, mouseY});
    let color = "grey";

    drawBackground();

    if(checkMousePos({x, y})){
      // mouseUpHandler(event);
      body.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("mouseup", mouseUpHandler);
      drawBackground();
    } else {
      if (checkCollisionZone({x, y}, radius, forbiddenZones) || checkTowerPos({x, y})) {
        color = "red";
      }
      // else if (checkTowerPos({x, y})) {
      //   color = "red";
      // }
      drawTower({x, y}, color);
      }
    }

  function mouseUpHandler(event) {
    body.removeEventListener("mousemove", mouseMoveHandler);
    canvas.removeEventListener("mouseup", mouseUpHandler);
    let {clientX: mouseX, clientY: mouseY} = event;
    let {x, y} = getTowerCoords({mouseX, mouseY});
    if(!checkCollisionZone({x, y}, radius, forbiddenZones) && !checkTowerPos({x, y})) {
      towers.push({x, y});
    }
    drawBackground();
  }

  drawBackground();
  addEventHandler();

};
