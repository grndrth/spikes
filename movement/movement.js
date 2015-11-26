export function moveToNextPosition (enemy, enemyInd, mapData, deadEnemies) {
  //  in welchem Mapsegment befindet sich horst nach seiner Bewegung?

  let {mapSeg: index, speed: direction, k: pos} = enemy;
  let actualMapSeg = mapData[index];
  let {nextX, nextY, nextT} = calcNextPosition(enemy, actualMapSeg);
  let endT = (1 / actualMapSeg.factor) || 1;

  if (direction > 0 && pos >= endT) {
    if (index + 1 >= mapData.length) {
      console.log("Feind ist durch");
      deadEnemies.push(enemyInd);
    } else {
      enemy.mapSeg = index + 1;
      enemy.k = 0;
    }
  } else if (direction < 0 && pos <= 0){
    if (index - 1 < 0) {
      console.log("Feind kifft");
      deadEnemies.push(enemyInd);
    } else {
      enemy.mapSeg = index - 1;
      enemy.k = (1 / mapData[index - 1].factor) || 1;
    }
  } else {
      enemy.x = nextX;
      enemy.y = nextY;
      enemy.k = nextT;
  }
}

export function deleteEnemies (enemies, deadEnemies) {
  deadEnemies.reverse().forEach((e) => {enemies.splice(e, 1); });
}

function calcNextPosition (enemy, mapSeg) {

  let mapSegType = mapSeg.type;
  if (mapSegType === "line") {
    return calcLineNextPosition(enemy, mapSeg);
  } else if (mapSegType === "circle") {
    return calcCircleNextPosition(enemy, mapSeg);
  }
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

function calcCircleNextPosition (enemy, mapSeg) {
  let {k: oldT, speed: v} = enemy;
  let {center: [mX, mY], shift: s, radius: r, length: l, factor: n, direction: d} = mapSeg;
  let deltaT = v / (n * l);
  let nextT = oldT + deltaT;

  // x = radius * cos( 2 * pi * (t - shift)) + mX
  let nextX = r * Math.cos(2 * Math.PI * d * (nextT - s)) + mX;
  let nextY = r * Math.sin(2 * Math.PI * d * (nextT - s)) + mY;

  return {nextX, nextY, nextT};
}
