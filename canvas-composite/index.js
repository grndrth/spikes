window.onload = function () {

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let qualm = new Image();
  // let pattern;
  qualm.onload = () => {
    // pattern = ctx.createPattern(qualm, "repeat");
    start();
  };
  qualm.src = "qualm.png";
  let arc = {x: 300, y: 125, r: 50};
  let arc2 = {x: 100, y: 125, r: 50};
  let p1 = {x: 100, y: 100};
  let p2 = {x: 300, y: 100};
  let p3 = {x: 300, y: 150};
  let p4 = {x: 100, y: 150};

  function animationLoop() {

    if (arc.x < 750) {
      window.requestAnimationFrame(animationLoop);
    }

    ctx.clearRect(0, 0, 800, 600);

    ctx.drawImage(qualm, 0, 0, 800, 600);

    ctx.globalCompositeOperation='destination-in';

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.closePath();
    ctx.arc(arc.x, arc.y, arc.r, 0, 2 * Math.PI);
    ctx.arc(arc2.x, arc2.y, arc2.r, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalCompositeOperation='source-over';

    p1.x += 1;
    p2.x += 1;
    p3.x += 1;
    p4.x += 1;
    arc.x += 1;
    arc2.x += 1;
  }


  function start() {
    animationLoop();
  }

  start();

};
