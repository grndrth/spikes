window.onload = circle;

function circle() {
  let c = document.getElementById("canvas");
  let context = c.getContext("2d");
  let counter = 0;
  const fps = 60;

  // let horst = {x: 750, y: 50, k: 0, color: "yellow", speed: -0.629};
  // let erna = {x: 150, y: 250, k: 0.25, color: "blue", speed: 0.629};
  let horst = {x: 750, y: 550, k: 1, color: "yellow", speed: -0.629};
  let erna = {x: 150, y: 350, k: 0, color: "blue", speed: 0.629};

  const kreis = {
    "type": "circle",
    "center": [150, 450],
    "radius": 100,
    "shift": 0.5,
    "factor": 4,
    "length": (200 * Math.PI)};

  const linie = {
      "type": "line",
      "dVector": [382, 500],
      "length": 629
  };

  // const kreis = {
  //   "type": "circle",
  //   "center": [150, 150],
  //   "radius": 100,
  //   "shift": 0.5,
  //   "factor": 1,
  //   "length": (200 * Math.PI)};
  //
  // const linie = {
  //     "type": "line",
  //     "dVector": [382, -500],
  //     "length": 629
  // };

  function gameLoop () {
    if (counter < 1000) {
      setTimeout(() => {
        gameLoop();
      }, fps / 1000);
    }
    // console.log(counter);
    counter += 1;

    moveLinear(horst, linie);
    moveCircular(erna, kreis);
    drawBackground(context);
    drawCircle(horst, context);
    drawCircle(erna, context);
  }

  resetCanvas(c, context);
  gameLoop();
}


  // function calcPositionfromT(t, shift, factor) {
  //   let nextX = 200 * Math.cos(2 * Math.PI * factor * (t - shift)) + 400;
  //   let nextY = 200 * Math.sin(2 * Math.PI * factor * (t - shift)) + 300;
  //   return {nextX, nextY};
  // }

  function resetCanvas(canvas, ctx) {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }

  function drawBackground(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#4BB9DE";
    ctx.fillRect(0, 0, 800, 600);
    ctx.arc(150, 450, 100, 0, 2 * Math.PI);
    ctx.moveTo(368, 50);
    ctx.lineTo(750, 550);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(368, 50, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(750, 550, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  }

  // function drawBackground(ctx) {
  //   ctx.beginPath();
  //   ctx.fillStyle = "#4BB9DE";
  //   ctx.fillRect(0, 0, 800, 600);
  //   ctx.arc(150, 150, 100, 0, 2 * Math.PI);
  //   ctx.moveTo(368, 550);
  //   ctx.lineTo(750, 50);
  //   ctx.strokeStyle = "red";
  //   ctx.stroke();
  //   ctx.closePath();
  //   ctx.beginPath();
  //   ctx.arc(368, 550, 5, 0, 2 * Math.PI);
  //   ctx.fillStyle = "red";
  //   ctx.fill();
  //   ctx.closePath();
  //   ctx.beginPath();
  //   ctx.arc(750, 50, 5, 0, 2 * Math.PI);
  //   ctx.fillStyle = "green";
  //   ctx.fill();
  //   ctx.closePath();
  // }

  function drawCircle(enemy, ctx) {
    let {x, y, color} = enemy;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function moveLinear(enemy, mapSeg) {
    let {nextX, nextY, nextT} = calcLineNextPosition(enemy, mapSeg);
    enemy.x = nextX;
    enemy.y = nextY;
    enemy.k = nextT;
  }

  function moveCircular(enemy, mapSeg) {
    let {nextX, nextY, nextT} = calcCircleNextPosition(enemy, mapSeg);
    enemy.x = nextX;
    enemy.y = nextY;
    enemy.k = nextT;
  }

  function calcLineNextPosition (enemy, mapSeg) {
    let {x: oldX, y: oldY, speed: v, k: oldT} = enemy;
    let {dVector: [dX, dY], length: l} = mapSeg;
    let deltaT = v / l;
    let nextT = oldT + deltaT;
    let nextX = deltaT * dX + oldX;
    let nextY = deltaT * dY + oldY;

    return {nextX, nextY, nextT};
  }


  function calcCircleNextPosition(enemy, mapSeg) {
    let {k: oldT, speed: v} = enemy;
    let {center: [mX, mY], shift: s, radius: r, length: l, factor: n} = mapSeg;
    let deltaT = v / (n * l);
    let nextT = oldT + deltaT;

    // x = radius * cos( 2 * pi * direction * (t - shift)) + mX
    let nextX = r * Math.cos(2 * Math.PI * (nextT - s)) + mX;
    let nextY = r * Math.sin(2 * Math.PI * (nextT - s)) + mY;

    return {nextX, nextY, nextT};
  }
