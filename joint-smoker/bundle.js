/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	window.onload = function () {
	
	  var canvas = document.getElementById("canvas");
	  var ctx = canvas.getContext("2d");
	  var towerImg = new Image();
	  var qualm = new Image();
	  towerImg.onload = function () {
	    qualm.onload = start;
	    qualm.src = "qualm.png";
	  };
	  towerImg.src = "tower.png";
	  var enemy1 = { x: 500, y: 500, radius: 15 };
	  var tower1 = { x: 500, y: 200, radius: 25 };
	  var factor = 2;
	  var targetFactor = 0;
	  var counter = 0;
	  var status = 0;
	
	  function animationLoop() {
	
	    if (counter <= 800) {
	      window.requestAnimationFrame(animationLoop);
	    }
	
	    ctx.clearRect(0, 0, 800, 600);
	    drawEnemy(enemy1, ctx);
	
	    if (counter > 120 && counter <= 600) {
	      status = 1;
	    } else {
	      status = 0;
	    }
	
	    if (status > 0) {
	      drawSmoke(enemy1, tower1, factor, targetFactor);
	      if (targetFactor < 1) {
	        targetFactor += 1 / 60;
	      } else {
	        targetFactor = 1;
	      }
	    }
	    drawTower(tower1, ctx, towerImg, status, enemy1);
	
	    enemy1.x += 1;
	    enemy1.y -= 1;
	    counter += 1;
	  }
	
	  function calcStartingPoint(target, tower) {
	    var eX = target.x;
	    var eY = target.y;
	    var rE = target.radius;
	    var tX = tower.x;
	    var tY = tower.y;
	
	    var deltaY = -(eX - tX);
	    var deltaX = eY - tY;
	    var factor = rE / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
	    var startX = eX + deltaX * factor;
	    var startY = eY + deltaY * factor;
	    return { startX: startX, startY: startY };
	  }
	
	  function calcStartingAngle(target, tower, startX) {
	    var eX = target.x;
	    var rE = target.radius;
	    var tX = tower.x;
	    // let {startX} = start;
	
	    var angle = undefined;
	    if (eX <= tX) {
	      angle = Math.PI - Math.acos((eX - startX) / rE);
	    } else {
	      angle = Math.PI + Math.acos((eX - startX) / rE);
	    }
	    return angle;
	  }
	
	  function calcSmokeTarget(enemy, tower, factor, targetFactor) {
	    var eX = enemy.x;
	    var eY = enemy.y;
	    var eR = enemy.radius;
	    var tX = tower.x;
	    var tY = tower.y;
	
	    var x = tX + targetFactor * (eX - tX);
	    var y = tY + targetFactor * (eY - tY);
	    var radius = eR * factor * targetFactor;
	    return { x: x, y: y, radius: radius };
	  }
	
	  function drawEnemy(enemy, ctx) {
	    ctx.beginPath();
	    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
	    ctx.fillStyle = "red";
	    ctx.fill();
	    ctx.closePath();
	  }
	
	  function drawTower(tower, ctx, img, status, enemy) {
	    if (status > 0) {
	      var smoke = calcSmokeTarget(enemy, tower, factor, targetFactor);
	
	      var _calcStartingPoint = calcStartingPoint(smoke, tower);
	
	      var startX = _calcStartingPoint.startX;
	      var startY = _calcStartingPoint.startY;
	
	      var startingAngle = calcStartingAngle(smoke, tower, startX);
	      ctx.save();
	      ctx.translate(tower.x, tower.y);
	      ctx.rotate(startingAngle - Math.PI);
	      ctx.drawImage(img, 0, status * 70, 60, 60, -tower.radius, -tower.radius, 2 * tower.radius, 2 * tower.radius);
	      ctx.restore();
	    } else {
	      ctx.drawImage(img, 0, status * 70, 60, 60, tower.x - tower.radius, tower.y - tower.radius, 2 * tower.radius, 2 * tower.radius);
	    }
	  }
	
	  function drawSmoke(enemy, tower, factor, targetFactor) {
	    var smoke = calcSmokeTarget(enemy, tower, factor, targetFactor);
	
	    var _calcStartingPoint2 = calcStartingPoint(smoke, tower);
	
	    var startX = _calcStartingPoint2.startX;
	    var startY = _calcStartingPoint2.startY;
	
	    var startingAngle = calcStartingAngle(smoke, tower, startX);
	    var endAngle = startingAngle + Math.PI;
	
	    ctx.save();
	    ctx.beginPath();
	    ctx.moveTo(tower.x, tower.y);
	    ctx.lineTo(startX, startY);
	    ctx.arc(smoke.x, smoke.y, smoke.radius, startingAngle, endAngle, false);
	    ctx.lineTo(tower.x, tower.y);
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTVmMzBjMzA2MDQyNWNlZGM1YjQiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQSxPQUFNLENBQUMsTUFBTSxHQUFHLFlBQVk7O0FBRTFCLE9BQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsT0FBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxPQUFJLFFBQVEsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQzNCLE9BQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDeEIsV0FBUSxDQUFDLE1BQU0sR0FBRyxZQUFNO0FBQ3RCLFVBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLFVBQUssQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDO0lBQ3pCLENBQUM7QUFDRixXQUFRLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQztBQUMzQixPQUFJLE1BQU0sR0FBRyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDLENBQUM7QUFDMUMsT0FBSSxNQUFNLEdBQUcsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDO0FBQzFDLE9BQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNmLE9BQUksWUFBWSxHQUFHLENB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QUFTLEtBQUssR0FBRztBQUNmLGtCQUFhLEVBQUUsQ0FBQztJQUNqQjtFQUVGLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAxNWYzMGMzMDYwNDI1Y2VkYzViNFxuICoqLyIsIndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgbGV0IHRvd2VySW1nID0gbmV3IEltYWdlKCk7XG4gIGxldCBxdWFsbSA9IG5ldyBJbWFnZSgpO1xuICB0b3dlckltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgcXVhbG0ub25sb2FkID0gc3RhcnQ7XG4gICAgcXVhbG0uc3JjID0gXCJxdWFsbS5wbmdcIjtcbiAgfTtcbiAgdG93ZXJJbWcuc3JjID0gXCJ0b3dlci5wbmdcIjtcbiAgbGV0IGVuZW15MSA9IHt4OiA1MDAsIHk6IDUwMCwgcmFkaXVzOiAxNX07XG4gIGxldCB0b3dlcjEgPSB7eDogNTAwLCB5OiAyMDAsIHJhZGl1czogMjV9O1xuICBsZXQgZmFjdG9yID0gMjtcbiAgbGV0IHRhcmdldEZhY3RvciA9IDA7XG4gIGxldCBjb3VudGVyID0gMDtcbiAgbGV0IHN0YXR1cyA9IDA7XG5cblxuICBmdW5jdGlvbiBhbmltYXRpb25Mb29wKCkge1xuXG4gICAgICBpZihjb3VudGVyIDw9IDgwMCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkxvb3ApO1xuICAgICAgfVxuXG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIDgwMCwgNjAwKTtcbiAgICAgIGRyYXdFbmVteShlbmVteTEsIGN0eCk7XG5cbiAgICAgIGlmKGNvdW50ZXIgPiAxMjAgJiYgY291bnRlciA8PSA2MDApIHtcbiAgICAgICAgc3RhdHVzID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1cyA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0dXMgPiAwKSB7XG4gICAgICAgIGRyYXdTbW9rZShlbmVteTEsIHRvd2VyMSwgZmFjdG9yLCB0YXJnZXRGYWN0b3IpO1xuICAgICAgICBpZih0YXJnZXRGYWN0b3IgPCAxKSB7XG4gICAgICAgICAgdGFyZ2V0RmFjdG9yICs9IDEvNjA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0RmFjdG9yID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZHJhd1Rvd2VyKHRvd2VyMSwgY3R4LCB0b3dlckltZywgc3RhdHVzLCBlbmVteTEpO1xuXG4gICAgICBlbmVteTEueCArPSAxO1xuICAgICAgZW5lbXkxLnkgLT0gMTtcbiAgICAgIGNvdW50ZXIgKz0gMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbGNTdGFydGluZ1BvaW50KHRhcmdldCwgdG93ZXIpIHtcbiAgICBsZXQge3g6IGVYLCB5OiBlWSwgcmFkaXVzOiByRX0gPSB0YXJnZXQ7XG4gICAgbGV0IHt4OiB0WCwgeTogdFl9ID0gdG93ZXI7XG4gICAgbGV0IGRlbHRhWSA9IC0oZVggLSB0WCk7XG4gICAgbGV0IGRlbHRhWCA9IGVZIC0gdFk7XG4gICAgbGV0IGZhY3RvciA9IHJFIC8gTWF0aC5zcXJ0KE1hdGgucG93KGRlbHRhWCwgMikgKyBNYXRoLnBvdyhkZWx0YVksIDIpKTtcbiAgICBsZXQgc3RhcnRYID0gZVggKyBkZWx0YVggKiBmYWN0b3I7XG4gICAgbGV0IHN0YXJ0WSA9IGVZICsgZGVsdGFZICogZmFjdG9yO1xuICAgIHJldHVybiB7c3RhcnRYLCBzdGFydFl9O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FsY1N0YXJ0aW5nQW5nbGUodGFyZ2V0LCB0b3dlciwgc3RhcnRYKSB7XG4gICAgbGV0IHt4OiBlWCwgcmFkaXVzOiByRX0gPSB0YXJnZXQ7XG4gICAgbGV0IHt4OiB0WH0gPSB0b3dlcjtcbiAgICAvLyBsZXQge3N0YXJ0WH0gPSBzdGFydDtcbiAgICBsZXQgYW5nbGU7XG4gICAgaWYoZVggPD0gdFgpIHtcbiAgICAgIGFuZ2xlID0gTWF0aC5QSSAtIE1hdGguYWNvcygoZVggLSBzdGFydFgpIC8gckUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbmdsZSA9IE1hdGguUEkgKyBNYXRoLmFjb3MoKGVYLXN0YXJ0WCkgLyByRSk7XG4gICAgfVxuICAgIHJldHVybiBhbmdsZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbGNTbW9rZVRhcmdldChlbmVteSwgdG93ZXIsIGZhY3RvciwgdGFyZ2V0RmFjdG9yKSB7XG4gICAgbGV0IHt4OiBlWCwgeTogZVksIHJhZGl1czogZVJ9ID0gZW5lbXk7XG4gICAgbGV0IHt4OiB0WCwgeTogdFl9ID0gdG93ZXI7XG4gICAgbGV0IHggPSB0WCArIHRhcmdldEZhY3RvciAqIChlWCAtIHRYKTtcbiAgICBsZXQgeSA9IHRZICsgdGFyZ2V0RmFjdG9yICogKGVZIC0gdFkpO1xuICAgIGxldCByYWRpdXMgPSBlUiAqIGZhY3RvciAqIHRhcmdldEZhY3RvcjtcbiAgICByZXR1cm4ge3gsIHksIHJhZGl1c307XG4gIH1cblxuICBmdW5jdGlvbiBkcmF3RW5lbXkoZW5lbXksIGN0eCkge1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKGVuZW15LngsIGVuZW15LnksIGVuZW15LnJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhd1Rvd2VyKHRvd2VyLCBjdHgsIGltZywgc3RhdHVzLCBlbmVteSkge1xuICAgIGlmKHN0YXR1cyA+IDApIHtcbiAgICAgIGxldCBzbW9rZSA9IGNhbGNTbW9rZVRhcmdldChlbmVteSwgdG93ZXIsIGZhY3RvciwgdGFyZ2V0RmFjdG9yKTtcbiAgICAgIGxldCB7c3RhcnRYLCBzdGFydFl9ID0gY2FsY1N0YXJ0aW5nUG9pbnQoc21va2UsIHRvd2VyKTtcbiAgICAgIGxldCBzdGFydGluZ0FuZ2xlID0gY2FsY1N0YXJ0aW5nQW5nbGUoc21va2UsIHRvd2VyLCBzdGFydFgpO1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC50cmFuc2xhdGUodG93ZXIueCwgdG93ZXIueSk7XG4gICAgICBjdHgucm90YXRlKHN0YXJ0aW5nQW5nbGUgLSBNYXRoLlBJKTtcbiAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCBzdGF0dXMgKiA3MCwgNjAsIDYwLCAtdG93ZXIucmFkaXVzICwgLXRvd2VyLnJhZGl1cywgMiAqIHRvd2VyLnJhZGl1cywgMiAqIHRvd2VyLnJhZGl1cyk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgc3RhdHVzICogNzAsIDYwLCA2MCwgdG93ZXIueCAtIHRvd2VyLnJhZGl1cywgdG93ZXIueSAtIHRvd2VyLnJhZGl1cywgMiAqIHRvd2VyLnJhZGl1cywgMiAqIHRvd2VyLnJhZGl1cyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZHJhd1Ntb2tlKGVuZW15LCB0b3dlciwgZmFjdG9yLCB0YXJnZXRGYWN0b3IpIHtcbiAgICBsZXQgc21va2UgPSBjYWxjU21va2VUYXJnZXQoZW5lbXksIHRvd2VyLCBmYWN0b3IsIHRhcmdldEZhY3Rvcik7XG4gICAgbGV0IHtzdGFydFgsIHN0YXJ0WX0gPSBjYWxjU3RhcnRpbmdQb2ludChzbW9rZSwgdG93ZXIpO1xuICAgIGxldCBzdGFydGluZ0FuZ2xlID0gY2FsY1N0YXJ0aW5nQW5nbGUoc21va2UsIHRvd2VyLCBzdGFydFgpO1xuICAgIGxldCBlbmRBbmdsZSA9IHN0YXJ0aW5nQW5nbGUgKyBNYXRoLlBJO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh0b3dlci54LCB0b3dlci55KTtcbiAgICBjdHgubGluZVRvKHN0YXJ0WCwgc3RhcnRZKTtcbiAgICBjdHguYXJjKHNtb2tlLngsIHNtb2tlLnksIHNtb2tlLnJhZGl1cywgc3RhcnRpbmdBbmdsZSwgZW5kQW5nbGUsIGZhbHNlKTtcbiAgICBjdHgubGluZVRvKHRvd2VyLngsIHRvd2VyLnkpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguY2xpcCgpO1xuICAgIGN0eC5kcmF3SW1hZ2UocXVhbG0sIDAsIDAsIDgwMCwgNjAwKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgLy8gZnVuY3Rpb24gY2FsY0Rpc3RhbmNlKGVuZW15LCB0b3dlcikge1xuICAvLyAgIGxldCB7eDogZVgsIHk6IGVZfSA9IGVuZW15O1xuICAvLyAgIGxldCB7eDogdFgsIHk6IHRZfSA9IHRvd2VyO1xuICAvLyAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKGVYIC0gdFgpLCAyKSArIE1hdGgucG93KChlWSAtIHRZKSwgMikpO1xuICAvL1xuICAvLyB9XG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIGFuaW1hdGlvbkxvb3AoKTtcbiAgfVxuXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9pbmRleC5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=