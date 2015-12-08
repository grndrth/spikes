/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	var _movement = __webpack_require__(1);

	var mov = _interopRequireWildcard(_movement);

	window.onload = function () {

	  var canvas = document.getElementById("canvas");
	  var ctx = canvas.getContext("2d");
	  var enemySprite = new Image();
	  enemySprite.onload = function () {
	    drawBackground();
	    gameLoop();
	  };
	  enemySprite.src = "sprite.svg";

	  var enemies = [];

	  var mapData = [];
	  var counter = 0;
	  var fps = 60;
	  var wurzel2 = Math.sqrt(2);
	  var pi = Math.PI;

	  var horst = { x: 0, y: 0, mapSeg: 0, speed: 0.8, k: 0, type: 0, orientation: 0, radius: 15 }; // speed in pixel per frame
	  var erna = { x: 0, y: 0, mapSeg: 0, speed: 1, k: 0, type: 1, orientation: 0, radius: 20 }; // speed in pixel per frame
	  // orientation: 0 - nach unten, 1 - nach oben, 2 - nach rechts, 3 - nach links
	  enemies.push(horst, erna);

	  var map0 = {
	    type: "line",
	    dVector: [250, 250],
	    length: wurzel2 * 250
	  };

	  var map1 = {
	    type: "circle",
	    center: [200, 300],
	    radius: wurzel2 * 50,
	    shift: 0.125,
	    factor: 1,
	    length: 100 * wurzel2 * pi,
	    direction: 1
	  };

	  var map2 = map0;

	  var map3 = {
	    type: "circle",
	    center: [575, 425],
	    radius: wurzel2 * 75,
	    shift: 0.375,
	    factor: 2,
	    length: 75 * wurzel2 * pi,
	    direction: -1
	  };

	  var map4 = {
	    type: "line",
	    dVector: [-150, -150],
	    length: wurzel2 * 150
	  };

	  var map5 = {
	    type: "circle",
	    center: [550, 150],
	    radius: wurzel2 * 50,
	    shift: 0.625,
	    factor: 8 / 3,
	    length: 37.5 * wurzel2 * pi,
	    direction: 1
	  };

	  var map6 = {
	    type: "line",
	    dVector: [250, 0],
	    length: 250
	  };

	  mapData.push(map0, map1, map2, map3, map4, map5, map6);

	  function drawBackground() {
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

	  // function drawCircle (enemy) {
	  //   let {x: x, y: y, color: color} = enemy;
	  //   ctx.beginPath();
	  //   ctx.arc(x, y, 10, 0, 2 * Math.PI);
	  //   ctx.closePath();
	  //   ctx.fillStyle = color;
	  //   ctx.fill();
	  // }

	  function drawEnemy(enemy) {
	    var x = enemy.x;
	    var y = enemy.y;
	    var t = enemy.type;
	    var o = enemy.orientation;
	    var r = enemy.radius;

	    ctx.drawImage(enemySprite, o * 60, t * 60, 50, 50, x - r, y - r, 2 * r, 2 * r);
	  }

	  function gameLoop() {

	    if (enemies.length > 0) {
	      setTimeout(function () {
	        gameLoop();
	      }, fps / 1000);
	    }

	    counter += 1;
	    var deadEnemies = [];
	    drawBackground();
	    enemies.forEach(function (e, i) {
	      var _mov$moveToNextPosition = mov.moveToNextPosition(e, i, mapData, deadEnemies);

	      var oldX = _mov$moveToNextPosition.oldX;
	      var oldY = _mov$moveToNextPosition.oldY;

	      mov.calcOrientation(e, oldX, oldY);
	    });
	    if (deadEnemies.length > 0) {
	      mov.deleteEnemies(enemies, deadEnemies);
	    }
	    enemies.forEach(drawEnemy);
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	exports.moveToNextPosition = moveToNextPosition;
	exports.deleteEnemies = deleteEnemies;
	exports.calcOrientation = calcOrientation;

	function moveToNextPosition(enemy, enemyInd, mapData, deadEnemies) {
	  //  in welchem Mapsegment befindet sich horst nach seiner Bewegung?

	  var oldX = enemy.x;
	  var oldY = enemy.y;
	  var index = enemy.mapSeg;
	  var direction = enemy.speed;
	  var pos = enemy.k;

	  var actualMapSeg = mapData[index];

	  var _calcNextPosition = calcNextPosition(enemy, actualMapSeg);

	  var nextX = _calcNextPosition.nextX;
	  var nextY = _calcNextPosition.nextY;
	  var nextT = _calcNextPosition.nextT;

	  var endT = 1 / actualMapSeg.factor || 1;

	  if (direction > 0 && pos >= endT) {
	    if (index + 1 >= mapData.length) {
	      console.log("Feind ist durch");
	      deadEnemies.push(enemyInd);
	    } else {
	      enemy.mapSeg = index + 1;
	      enemy.k = 0;
	    }
	  } else if (direction < 0 && pos <= 0) {
	    if (index - 1 < 0) {
	      console.log("Feind kifft");
	      deadEnemies.push(enemyInd);
	    } else {
	      enemy.mapSeg = index - 1;
	      enemy.k = 1 / mapData[index - 1].factor || 1;
	    }
	  } else {
	    enemy.x = nextX;
	    enemy.y = nextY;
	    enemy.k = nextT;
	  }
	  return { oldX: oldX, oldY: oldY };
	}

	function deleteEnemies(enemies, deadEnemies) {
	  deadEnemies.reverse().forEach(function (e) {
	    enemies.splice(e, 1);
	  });
	}

	function calcNextPosition(enemy, mapSeg) {

	  var mapSegType = mapSeg.type;
	  if (mapSegType === "line") {
	    return calcLineNextPosition(enemy, mapSeg);
	  } else if (mapSegType === "circle") {
	    return calcCircleNextPosition(enemy, mapSeg);
	  }
	}

	function calcLineNextPosition(enemy, mapSeg) {
	  var oldX = enemy.x;
	  var oldY = enemy.y;
	  var v = enemy.speed;
	  var oldT = enemy.k;

	  var _mapSeg$dVector = _slicedToArray(mapSeg.dVector, 2);

	  var dX = _mapSeg$dVector[0];
	  var dY = _mapSeg$dVector[1];
	  var l = mapSeg.length;

	  var deltaT = v / l;
	  var nextT = oldT + deltaT;

	  var nextX = deltaT * dX + oldX;
	  var nextY = deltaT * dY + oldY;

	  return { nextX: nextX, nextY: nextY, nextT: nextT };
	}

	function calcCircleNextPosition(enemy, mapSeg) {
	  var oldT = enemy.k;
	  var v = enemy.speed;

	  var _mapSeg$center = _slicedToArray(mapSeg.center, 2);

	  var mX = _mapSeg$center[0];
	  var mY = _mapSeg$center[1];
	  var s = mapSeg.shift;
	  var r = mapSeg.radius;
	  var l = mapSeg.length;
	  var n = mapSeg.factor;
	  var d = mapSeg.direction;

	  var deltaT = v / (n * l);
	  var nextT = oldT + deltaT;

	  // x = radius * cos( 2 * pi * (t - shift)) + mX
	  var nextX = r * Math.cos(2 * Math.PI * d * (nextT - s)) + mX;
	  var nextY = r * Math.sin(2 * Math.PI * d * (nextT - s)) + mY;

	  return { nextX: nextX, nextY: nextY, nextT: nextT };
	}

	function calcOrientation(enemy, oldX, oldY) {
	  var nextX = enemy.x;
	  var nextY = enemy.y;

	  var deltaX = nextX - oldX;
	  var deltaY = nextY - oldY;
	  var absDeltaX = Math.abs(deltaX);
	  var absDeltaY = Math.abs(deltaY);

	  if (deltaY > 0 && absDeltaX <= absDeltaY) {
	    enemy.orientation = 0;
	  } else if (deltaY < 0 && absDeltaX <= absDeltaY) {
	    enemy.orientation = 1;
	  } else if (deltaX > 0) {
	    enemy.orientation = 2;
	  } else if (deltaX < 0) {
	    enemy.orientation = 3;
	  }
	}

/***/ }
/******/ ]);