function pythagoras(a, b) {
  return Math.sqrt(a * a + b * b);
}

function calcDistance(x1, y1, x2, y2) {
    let deltaX = x1 - x2;
    let deltaY = y1 - y2;
    return pythagoras(deltaX, deltaY);
}

export function checkEnemyinRange(tower, enemies) {
  let target = enemies.findIndex((enemy) => {
    let {x: x1, y: y1} = tower;
    let {x: x2, y: y2} = enemy;
    let distance = calcDistance(x1, y1, x2, y2);
    if (enemy.speed > 0) {
      return distance < tower.range;
    } else {
      return false;
    }
  });
  return target;
}

export function checkImpact(enemy, area) {
  let {x: xE, y: yE} = enemy;
  let {x: xA, y: yA, radius: rA} = area;
  let distance = calcDistance(xE, yE, xA, yA);
  return distance < rA;
}
