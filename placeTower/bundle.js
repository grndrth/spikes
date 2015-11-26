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

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _drawMap = __webpack_require__(1);

	var _const = __webpack_require__(2);

	window.onload = function () {

	  var canvas = document.getElementById("canvas");
	  var ctx = canvas.getContext("2d");
	  var bRect = canvas.getBoundingClientRect();
	  var towers = [];
	  var radius = 30;
	  var body = document.getElementsByTagName("body")[0];
	  var forbiddenZones = [{
	    type: "line",
	    start: [150, 0],
	    vector: [0, 425]
	  }, {
	    type: "line",
	    start: [400, 425],
	    vector: [0, -175]
	  }, {
	    type: "line",
	    start: [570.71, 179.29],
	    vector: [229.29, 229.29]
	  }, {
	    type: "circle",
	    center: [275, 425],
	    vector: [0, 125],
	    angle: 0.5 * _const.pi,
	    radius: 125
	  }, {
	    type: "circle",
	    center: [500, 250],
	    vector: [-38.27, -92.39],
	    angle: 0.375 * _const.pi,
	    radius: 100
	  }];

	  function addEventHandler() {
	    canvas.addEventListener("mousedown", mouseDownHandler);
	  }

	  function getTowerCoords(_ref) {
	    var mouseX = _ref.mouseX;
	    var mouseY = _ref.mouseY;
	    var top = bRect.top;
	    var left = bRect.left;

	    var x = mouseX - left;
	    var y = mouseY - top;
	    return { x: x, y: y };
	  }

	  function checkTowerPos(_ref2) {
	    var x = _ref2.x;
	    var y = _ref2.y;

	    var top = y < _const.rand + radius || y > 600 - _const.rand - radius;
	    var left = x < _const.rand + radius || x > 800 - _const.rand - radius;

	    if (top || left) {
	      return true;
	    } else {
	      return towers.some(function (e) {
	        var nX = e.x;
	        var nY = e.y;

	        var distance = Math.sqrt(Math.pow(x - nX, 2) + Math.pow(y - nY, 2)) / 2;
	        return distance < radius;
	      });
	    }
	  }

	  function checkMousePos(_ref3) {
	    var x = _ref3.x;
	    var y = _ref3.y;

	    var top = y < 0 || y > canvas.height;
	    var left = x < 0 || x > canvas.width;
	    return top || left;
	  }

	  function calcPerpFoot(_ref4, r, zone) {
	    var x = _ref4.x;
	    var y = _ref4.y;

	    var _zone$start = _slicedToArray(zone.start, 2);

	    var xS = _zone$start[0];
	    var yS = _zone$start[1];

	    var _zone$vector = _slicedToArray(zone.vector, 2);

	    var vX = _zone$vector[0];
	    var vY = _zone$vector[1];

	    var t = ((x - xS) * vX + (y - yS) * vY) / (vX * vX + vY * vY);
	    if (t < 0 || t > 1) {
	      return false;
	    } else {
	      var xP = xS + t * vX;
	      var yP = yS + t * vY;
	      var dist = Math.sqrt((x - xP) * (x - xP) + (y - yP) * (y - yP));
	      return dist < r + _const.wegdicke;
	    }
	  }

	  function checkCircleCollision(_ref5, rTower, zone) {
	    var x = _ref5.x;
	    var y = _ref5.y;

	    var _zone$center = _slicedToArray(zone.center, 2);

	    var xM = _zone$center[0];
	    var yM = _zone$center[1];

	    var _zone$vector2 = _slicedToArray(zone.vector, 2);

	    var vX = _zone$vector2[0];
	    var vY = _zone$vector2[1];
	    var a = zone.angle;
	    var r = zone.radius;

	    var pX = x - xM;
	    var pY = y - yM;
	    var length = Math.sqrt(pX * pX + pY * pY);
	    var pAngle = Math.acos((pX * vX + pY * vY) / (r * length));
	    if (pAngle > a) {
	      return false;
	    } else {
	      var dist = Math.abs(r - length);
	      if (dist >= _const.wegdicke + rTower) {
	        return false;
	      } else {
	        return true;
	      }
	    }
	  }

	  function checkCollisionZone(_ref6, r, zones) {
	    var x = _ref6.x;
	    var y = _ref6.y;

	    return zones.some(function (e) {
	      var type = e.type;

	      if (type === "line") {
	        return calcPerpFoot({ x: x, y: y }, r, e);
	      } else if (type === "circle") {
	        return checkCircleCollision({ x: x, y: y }, r, e);
	      }
	    });
	  }

	  function drawBackground() {
	    ctx.fillStyle = "white";
	    ctx.fillRect(0, 0, 800, 600);
	    (0, _drawMap.drawMap1)(ctx);
	    towers.forEach(function (e) {
	      return drawTower(e);
	    });
	  }

	  function drawTower(_ref7) {
	    var x = _ref7.x;
	    var y = _ref7.y;
	    var color = arguments.length <= 1 || arguments[1] === undefined ? "grey" : arguments[1];

	    ctx.beginPath();
	    ctx.arc(x, y, radius, 0, 2 * _const.pi);
	    ctx.fillStyle = color;
	    ctx.fill();
	    ctx.closePath();
	    ctx.beginPath();
	    ctx.arc(x, y, 5 * radius, 0, 2 * _const.pi);
	    ctx.strokeStyle = color;
	    ctx.stroke();
	    ctx.closePath();
	  }

	  function mouseDownHandler(event) {
	    body.addEventListener("mousemove", mouseMoveHandler);
	    canvas.addEventListener("mouseup", mouseUpHandler);
	    var mouseX = event.clientX;
	    var mouseY = event.clientY;

	    var _getTowerCoords = getTowerCoords({ mouseX: mouseX, mouseY: mouseY });

	    var x = _getTowerCoords.x;
	    var y = _getTowerCoords.y;

	    var color = "grey";
	    if (checkTowerPos({ x: x, y: y })) {
	      color = "red";
	    }
	    drawTower({ x: x, y: y }, color);
	  }

	  function mouseMoveHandler(event) {
	    var mouseX = event.clientX;
	    var mouseY = event.clientY;

	    var _getTowerCoords2 = getTowerCoords({ mouseX: mouseX, mouseY: mouseY });

	    var x = _getTowerCoords2.x;
	    var y = _getTowerCoords2.y;

	    var color = "grey";

	    drawBackground();

	    if (checkMousePos({ x: x, y: y })) {
	      // mouseUpHandler(event);
	      body.removeEventListener("mousemove", mouseMoveHandler);
	      canvas.removeEventListener("mouseup", mouseUpHandler);
	      drawBackground();
	    } else {
	      if (checkCollisionZone({ x: x, y: y }, radius, forbiddenZones) || checkTowerPos({ x: x, y: y })) {
	        color = "red";
	      }
	      // else if (checkTowerPos({x, y})) {
	      //   color = "red";
	      // }
	      drawTower({ x: x, y: y }, color);
	    }
	  }

	  function mouseUpHandler(event) {
	    body.removeEventListener("mousemove", mouseMoveHandler);
	    canvas.removeEventListener("mouseup", mouseUpHandler);
	    var mouseX = event.clientX;
	    var mouseY = event.clientY;

	    var _getTowerCoords3 = getTowerCoords({ mouseX: mouseX, mouseY: mouseY });

	    var x = _getTowerCoords3.x;
	    var y = _getTowerCoords3.y;

	    if (!checkCollisionZone({ x: x, y: y }, radius, forbiddenZones) && !checkTowerPos({ x: x, y: y })) {
	      towers.push({ x: x, y: y });
	    }
	    drawBackground();
	  }

	  drawBackground();
	  addEventHandler();
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.drawMap1 = drawMap1;

	var _const = __webpack_require__(2);

	function drawMap1(ctx) {
	  ctx.fillStyle = "pink";
	  ctx.fillRect(125, 0, 50, 425);
	  ctx.fillRect(375, 250, 50, 175);
	  ctx.fillRect(0, 0, 800, _const.rand);
	  ctx.fillRect(0, 0, _const.rand, 600);
	  ctx.fillRect(800 - _const.rand, 0, _const.rand, 600);
	  ctx.fillRect(0, 600 - _const.rand, 800, _const.rand);
	  ctx.beginPath();
	  ctx.arc(275, 425, 150, 0, _const.pi);
	  ctx.fillStyle = "pink";
	  ctx.fill();
	  ctx.closePath();
	  ctx.beginPath();
	  ctx.arc(275, 425, 100, 0, _const.pi);
	  ctx.fillStyle = "white";
	  ctx.fill();
	  ctx.closePath();
	  ctx.beginPath();
	  ctx.arc(500, 250, 125, _const.pi, 2 * _const.pi);
	  ctx.fillStyle = "pink";
	  ctx.fill();
	  ctx.closePath();
	  ctx.beginPath();
	  ctx.arc(500, 250, 75, _const.pi, 2 * _const.pi);
	  ctx.fillStyle = "white";
	  ctx.fill();
	  ctx.closePath();
	  ctx.beginPath();
	  ctx.moveTo(500, 250);
	  ctx.lineTo(675, 75);
	  ctx.lineTo(750, 150);
	  ctx.lineTo(575, 325);
	  ctx.lineTo(500, 250);
	  ctx.fillStyle = "white";
	  ctx.fill();
	  ctx.closePath();
	  ctx.beginPath();
	  ctx.moveTo(553.033, 196.967);
	  ctx.lineTo(588.388, 161.612);
	  ctx.lineTo(800, 373.224);
	  ctx.lineTo(800, 443.934);
	  ctx.lineTo(553.033, 196.967);
	  ctx.fillStyle = "pink";
	  ctx.fill();
	  ctx.closePath();
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var pi = Math.PI;
	exports.pi = pi;
	var rand = 25;
	exports.rand = rand;
	var wegdicke = 25;
	exports.wegdicke = wegdicke;

/***/ }
/******/ ]);