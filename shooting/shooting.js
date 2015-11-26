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
    return distance < tower.range;
  });
  return target;
}
