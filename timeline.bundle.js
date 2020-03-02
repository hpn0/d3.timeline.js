(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["d3", "moment"], factory);
	else if(typeof exports === 'object')
		exports["timeline"] = factory(require("d3"), require("moment"));
	else
		root["timeline"] = factory(root["d3"], root["moment"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_d3__, __WEBPACK_EXTERNAL_MODULE_moment__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/timeline.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/timeline.js":
/*!*************************!*\
  !*** ./src/timeline.js ***!
  \*************************/
/*! exports provided: chart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "chart", function() { return chart; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);



const defaultOption = {
  height: 400,
  width: 600,
  rangeHeight: 10,
  rangeSpacing: 40,
  rangeCornerRadius: 5,
  onHover: function() {},
  onClick: function() {}
}

/**
 * Entry point to create a Timeline Chart.  This function will initialize different layers of the chart including:
 * background axies and multiple lanes for event ranges
 * @param {Element} container 
 * @param {int} width 
 * @param {int} height 
 * @param {Object} options 
 */
function chart(container, data, options) {
  // Define the original scale, original scales will be used for zoom transformation
  this.options = {...defaultOption, ...options}
  this.data = data
  let width = this.options.width
  let height = this.options.height

  let left = this.data.map(item => item.start).reduce( (prev, cur) => Math.min(prev, cur))
  let right = this.data.map(item => item.end).reduce( (prev, cur) => Math.max(prev, cur))

  left = moment__WEBPACK_IMPORTED_MODULE_1___default()(left).add('month', -2)
  right = moment__WEBPACK_IMPORTED_MODULE_1___default()(right).add('month', 2)

  let origScaleX = d3__WEBPACK_IMPORTED_MODULE_0__["scaleTime"]()
    .domain([left, right])
    .range([0, width]);

  let origScaleY = d3__WEBPACK_IMPORTED_MODULE_0__["scaleLinear"]()
    .domain([0, height])
    .range([20, height]);

  // The current Scales after transformation
  this.scaleX = origScaleX
  this.scaleY = origScaleY

  // Create the root SVG object within the given HTML element container
  this.svg = d3__WEBPACK_IMPORTED_MODULE_0__["select"](container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // Create the axis layer
  this.svg.append("g")
    .attr('class', 'axis')
  this.svg.append("g")
    .attr('class', 'axis2')
    .attr('transform', 'translate(0, 17)')

  // This line seperate the two axies
  this.svg.append("g").append('line')
    .attr('x1', 0)
    .attr('y1', 16)
    .attr('x2', width)
    .attr('y2', 16)
    .attr("stroke-width", 1 )
    .attr("stroke", 'black' )
    .attr("stroke-opacity", 0.5)

  // Define a clip path render the ranges.  This will preventhe ranges from drawing on top of our axies
  this.svg.append("clipPath")       
    .attr("id", "main-area") 
    .append("rect")          
    .attr("width", width)
    .attr("height", height);

  // Create the foreground layer, we will use this layer to draw the events/ranges
  let fg = this.svg.append("g")
    .attr("clip-path", "url(#main-area)") // clip the rectangle
    .attr('transform', 'translate(0, 50)') 
    .attr("class", "fg")

  // Define the zoom function callback
  let zoomed = () => {
    this.scaleX = d3__WEBPACK_IMPORTED_MODULE_0__["event"].transform.rescaleX(origScaleX);

    // Prevent Vertical scaling
    let k = d3__WEBPACK_IMPORTED_MODULE_0__["event"].transform.k
    d3__WEBPACK_IMPORTED_MODULE_0__["event"].transform.k = 1;
    this.scaleY = d3__WEBPACK_IMPORTED_MODULE_0__["event"].transform.rescaleY(origScaleY);
    d3__WEBPACK_IMPORTED_MODULE_0__["event"].transform.k = k;
    this.draw()
  }

  // Create a zoom object and their extents
  let zoom = d3__WEBPACK_IMPORTED_MODULE_0__["zoom"]()
      .scaleExtent([1, 2])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .translateExtent([[0, 0], [width * 1.25, 2 * height]])
      .on("zoom", zoomed)

  // Call the zoom object on the entire SVG
  this.svg.call(zoom)
  drawRanges(fg, this.data, this.scaleX, this.options)
  this.draw()
}

chart.prototype.draw = function() {

  let axis = this.svg.select('.axis')
  let axis2 = this.svg.select('.axis2')
  let fg = this.svg.select('.fg')
  drawYear(axis, this.scaleX)
  drawAxis(axis2, this.scaleX)
  if(this.data)
    updateRanges(fg, this.data, this.scaleX, this.scaleY, this.options)
}
/**
 * Private function to draw the Year axis 
 * @param {Graphic} g 
 * @param {Scale} scale 
 */
function drawYear(g, scale) {
  g.call(d3__WEBPACK_IMPORTED_MODULE_0__["axisBottom"](scale)
           .ticks(d3__WEBPACK_IMPORTED_MODULE_0__["timeYear"].every(1))
           .tickSize(15)
           .tickFormat(d => moment__WEBPACK_IMPORTED_MODULE_1___default()(d).format('YYYY')))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick text")
      .attr("y", 5)
      .attr("dx", 20))
    .call(g => g.selectAll(".tick line")
      .attr("stroke-dasharray", "2,2")
      .attr("stroke-opacity", 0.5))
}

/**
 * Draw the secondary axis 
 * @param {Graphic} g 
 * @param {Scale} scale 
 */
function drawAxis(g, scale) {
  g
    .call(d3__WEBPACK_IMPORTED_MODULE_0__["axisBottom"](scale)
            .tickSize(500)
            .tickFormat(d => moment__WEBPACK_IMPORTED_MODULE_1___default()(d).format('MMM'))
            .tickSizeOuter(-300)
    )
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "2,2"))
    .call(g => g.selectAll(".tick text")
      .attr("y", 8)
      .attr("dx", 15))

}

/**
 * Update the Positions of the events and ranges
 * @param {Graphic} fg 
 * @param {Object} data 
 * @param {Scale} scaleX 
 * @param {Scale} scaleY 
 */
let updateRanges = (fg, data, scaleX, scaleY, options) => {
  let updateLane = (g) => {
    g.attr('transform', (range, i) => `translate(${scaleX(range.start)}, ${scaleY(i * (options.rangeHeight + options.rangeSpacing))})`)
  }
  let updateBar = (g) => {
    g.attr('width', range => scaleX(range.end) - scaleX(range.start))
  }

  fg
    .selectAll('.lane')
    .data(data)
    .transition()
    .duration(10)
    .call(updateLane)

  fg
    .selectAll('.bar')
    .data(data)
    .transition()
    .duration(10)
    .call(updateBar)
}

/**
 * Draw all the events on the foreground layer
 * @param {Graphic} fg 
 * @param {Object} data 
 * @param {Scale} scale 
 */
let drawRanges = (fg, data, scale, options) => {
  if(!data) return

  let drawBar = (g) => {
    g.append('rect')
        .attr('class', 'bar')
        .attr('rx', options.rangeCornerRadius)
        .attr('ry', options.rangeCornerRadius)
        .attr('width', range => scale(range.end) - scale(range.start))
        .attr('height', range => options.rangeHeight)
        .attr('fill', range => range.color)
        .on("mouseover", function(range) {
          d3__WEBPACK_IMPORTED_MODULE_0__["select"](this).attr('fill', "orange");
          d3__WEBPACK_IMPORTED_MODULE_0__["select"](this).attr('cursor', "pointer");
          options.onHover(range)
        })
        .on("mouseout", function(range) {
          d3__WEBPACK_IMPORTED_MODULE_0__["select"](this).attr('fill', range.color);
          d3__WEBPACK_IMPORTED_MODULE_0__["select"](this).attr('cursor', "default");
        })
        .on('click', options.onClick)
  }

  let drawLabel= (g) => {
    let label = g.append('g')
      .attr('class', 'label')
      .attr('transform', `translate(0, ${options.rangeHeight + 12})`)

    label.append('text')
      .call(
        g => g.append('tspan')
          .text( range => moment__WEBPACK_IMPORTED_MODULE_1___default()(range.start).format('MM/YYYY') + "-" + moment__WEBPACK_IMPORTED_MODULE_1___default()(range.end).format('MM/YYYY') )
          .attr("font-family", "Arial")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("line-height", "22px")
          .attr("fill", "black")
      )
      .call(
        g => g.append('tspan')
          .text( range => range.title )
          .attr("dx", 5)
          .attr("font-family", "Arial")
          .attr("font-size", "12px")
          .attr("line-height", "24px")
          .attr("fill", "black")
      )
  }

  let lanes = fg.selectAll('.lane').data(data)
  lanes.enter().append('g')
    .attr("class", "lane")
    .attr('transform', (range, i) => `translate(${scale(range.start)}, ${i * (options.rangeHeight + options.rangeSpacing)})`)
    .call(drawBar)
    .call(drawLabel)
}

/***/ }),

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_d3__;

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_moment__;

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aW1lbGluZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vdGltZWxpbmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGltZWxpbmUvLi9zcmMvdGltZWxpbmUuanMiLCJ3ZWJwYWNrOi8vdGltZWxpbmUvZXh0ZXJuYWwgXCJkM1wiIiwid2VicGFjazovL3RpbWVsaW5lL2V4dGVybmFsIFwibW9tZW50XCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXdCO0FBQ0c7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZixXQUFXLE9BQU87QUFDbEI7QUFDTztBQUNQO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFNBQVMsNkNBQU07QUFDZixVQUFVLDZDQUFNOztBQUVoQixtQkFBbUIsNENBQVk7QUFDL0I7QUFDQTs7QUFFQSxtQkFBbUIsOENBQWM7QUFDakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLHlDQUFTO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0Isd0NBQVE7O0FBRTFCO0FBQ0EsWUFBWSx3Q0FBUTtBQUNwQixJQUFJLHdDQUFRO0FBQ1osa0JBQWtCLHdDQUFRO0FBQzFCLElBQUksd0NBQVE7QUFDWjtBQUNBOztBQUVBO0FBQ0EsYUFBYSx1Q0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBLFNBQVMsNkNBQWE7QUFDdEIsa0JBQWtCLDJDQUFXO0FBQzdCO0FBQ0EsNEJBQTRCLDZDQUFNO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBO0FBQ0EsVUFBVSw2Q0FBYTtBQUN2QjtBQUNBLDZCQUE2Qiw2Q0FBTTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEIsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsTUFBTTtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsb0JBQW9CLElBQUkseURBQXlEO0FBQ3BJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztBQUNsQixXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUseUNBQVM7QUFDbkIsVUFBVSx5Q0FBUztBQUNuQjtBQUNBLFNBQVM7QUFDVDtBQUNBLFVBQVUseUNBQVM7QUFDbkIsVUFBVSx5Q0FBUztBQUNuQixTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMseUJBQXlCOztBQUVsRTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNkNBQU0sd0NBQXdDLDZDQUFNO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxtQkFBbUIsSUFBSSxpREFBaUQ7QUFDMUg7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDeFBBLGdEOzs7Ozs7Ozs7OztBQ0FBLG9EIiwiZmlsZSI6InRpbWVsaW5lLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImQzXCIpLCByZXF1aXJlKFwibW9tZW50XCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImQzXCIsIFwibW9tZW50XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInRpbWVsaW5lXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiZDNcIiksIHJlcXVpcmUoXCJtb21lbnRcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInRpbWVsaW5lXCJdID0gZmFjdG9yeShyb290W1wiZDNcIl0sIHJvb3RbXCJtb21lbnRcIl0pO1xufSkod2luZG93LCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2QzX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfbW9tZW50X18pIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy90aW1lbGluZS5qc1wiKTtcbiIsImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJ1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnXG5cbmNvbnN0IGRlZmF1bHRPcHRpb24gPSB7XG4gIGhlaWdodDogNDAwLFxuICB3aWR0aDogNjAwLFxuICByYW5nZUhlaWdodDogMTAsXG4gIHJhbmdlU3BhY2luZzogNDAsXG4gIHJhbmdlQ29ybmVyUmFkaXVzOiA1LFxuICBvbkhvdmVyOiBmdW5jdGlvbigpIHt9LFxuICBvbkNsaWNrOiBmdW5jdGlvbigpIHt9XG59XG5cbi8qKlxuICogRW50cnkgcG9pbnQgdG8gY3JlYXRlIGEgVGltZWxpbmUgQ2hhcnQuICBUaGlzIGZ1bmN0aW9uIHdpbGwgaW5pdGlhbGl6ZSBkaWZmZXJlbnQgbGF5ZXJzIG9mIHRoZSBjaGFydCBpbmNsdWRpbmc6XG4gKiBiYWNrZ3JvdW5kIGF4aWVzIGFuZCBtdWx0aXBsZSBsYW5lcyBmb3IgZXZlbnQgcmFuZ2VzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRhaW5lciBcbiAqIEBwYXJhbSB7aW50fSB3aWR0aCBcbiAqIEBwYXJhbSB7aW50fSBoZWlnaHQgXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoYXJ0KGNvbnRhaW5lciwgZGF0YSwgb3B0aW9ucykge1xuICAvLyBEZWZpbmUgdGhlIG9yaWdpbmFsIHNjYWxlLCBvcmlnaW5hbCBzY2FsZXMgd2lsbCBiZSB1c2VkIGZvciB6b29tIHRyYW5zZm9ybWF0aW9uXG4gIHRoaXMub3B0aW9ucyA9IHsuLi5kZWZhdWx0T3B0aW9uLCAuLi5vcHRpb25zfVxuICB0aGlzLmRhdGEgPSBkYXRhXG4gIGxldCB3aWR0aCA9IHRoaXMub3B0aW9ucy53aWR0aFxuICBsZXQgaGVpZ2h0ID0gdGhpcy5vcHRpb25zLmhlaWdodFxuXG4gIGxldCBsZWZ0ID0gdGhpcy5kYXRhLm1hcChpdGVtID0+IGl0ZW0uc3RhcnQpLnJlZHVjZSggKHByZXYsIGN1cikgPT4gTWF0aC5taW4ocHJldiwgY3VyKSlcbiAgbGV0IHJpZ2h0ID0gdGhpcy5kYXRhLm1hcChpdGVtID0+IGl0ZW0uZW5kKS5yZWR1Y2UoIChwcmV2LCBjdXIpID0+IE1hdGgubWF4KHByZXYsIGN1cikpXG5cbiAgbGVmdCA9IG1vbWVudChsZWZ0KS5hZGQoJ21vbnRoJywgLTIpXG4gIHJpZ2h0ID0gbW9tZW50KHJpZ2h0KS5hZGQoJ21vbnRoJywgMilcblxuICBsZXQgb3JpZ1NjYWxlWCA9IGQzLnNjYWxlVGltZSgpXG4gICAgLmRvbWFpbihbbGVmdCwgcmlnaHRdKVxuICAgIC5yYW5nZShbMCwgd2lkdGhdKTtcblxuICBsZXQgb3JpZ1NjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKFswLCBoZWlnaHRdKVxuICAgIC5yYW5nZShbMjAsIGhlaWdodF0pO1xuXG4gIC8vIFRoZSBjdXJyZW50IFNjYWxlcyBhZnRlciB0cmFuc2Zvcm1hdGlvblxuICB0aGlzLnNjYWxlWCA9IG9yaWdTY2FsZVhcbiAgdGhpcy5zY2FsZVkgPSBvcmlnU2NhbGVZXG5cbiAgLy8gQ3JlYXRlIHRoZSByb290IFNWRyBvYmplY3Qgd2l0aGluIHRoZSBnaXZlbiBIVE1MIGVsZW1lbnQgY29udGFpbmVyXG4gIHRoaXMuc3ZnID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXG5cbiAgLy8gQ3JlYXRlIHRoZSBheGlzIGxheWVyXG4gIHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAuYXR0cignY2xhc3MnLCAnYXhpcycpXG4gIHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAuYXR0cignY2xhc3MnLCAnYXhpczInKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDE3KScpXG5cbiAgLy8gVGhpcyBsaW5lIHNlcGVyYXRlIHRoZSB0d28gYXhpZXNcbiAgdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKS5hcHBlbmQoJ2xpbmUnKVxuICAgIC5hdHRyKCd4MScsIDApXG4gICAgLmF0dHIoJ3kxJywgMTYpXG4gICAgLmF0dHIoJ3gyJywgd2lkdGgpXG4gICAgLmF0dHIoJ3kyJywgMTYpXG4gICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMSApXG4gICAgLmF0dHIoXCJzdHJva2VcIiwgJ2JsYWNrJyApXG4gICAgLmF0dHIoXCJzdHJva2Utb3BhY2l0eVwiLCAwLjUpXG5cbiAgLy8gRGVmaW5lIGEgY2xpcCBwYXRoIHJlbmRlciB0aGUgcmFuZ2VzLiAgVGhpcyB3aWxsIHByZXZlbnRoZSByYW5nZXMgZnJvbSBkcmF3aW5nIG9uIHRvcCBvZiBvdXIgYXhpZXNcbiAgdGhpcy5zdmcuYXBwZW5kKFwiY2xpcFBhdGhcIikgICAgICAgXG4gICAgLmF0dHIoXCJpZFwiLCBcIm1haW4tYXJlYVwiKSBcbiAgICAuYXBwZW5kKFwicmVjdFwiKSAgICAgICAgICBcbiAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBmb3JlZ3JvdW5kIGxheWVyLCB3ZSB3aWxsIHVzZSB0aGlzIGxheWVyIHRvIGRyYXcgdGhlIGV2ZW50cy9yYW5nZXNcbiAgbGV0IGZnID0gdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xpcC1wYXRoXCIsIFwidXJsKCNtYWluLWFyZWEpXCIpIC8vIGNsaXAgdGhlIHJlY3RhbmdsZVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDUwKScpIFxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJmZ1wiKVxuXG4gIC8vIERlZmluZSB0aGUgem9vbSBmdW5jdGlvbiBjYWxsYmFja1xuICBsZXQgem9vbWVkID0gKCkgPT4ge1xuICAgIHRoaXMuc2NhbGVYID0gZDMuZXZlbnQudHJhbnNmb3JtLnJlc2NhbGVYKG9yaWdTY2FsZVgpO1xuXG4gICAgLy8gUHJldmVudCBWZXJ0aWNhbCBzY2FsaW5nXG4gICAgbGV0IGsgPSBkMy5ldmVudC50cmFuc2Zvcm0ua1xuICAgIGQzLmV2ZW50LnRyYW5zZm9ybS5rID0gMTtcbiAgICB0aGlzLnNjYWxlWSA9IGQzLmV2ZW50LnRyYW5zZm9ybS5yZXNjYWxlWShvcmlnU2NhbGVZKTtcbiAgICBkMy5ldmVudC50cmFuc2Zvcm0uayA9IGs7XG4gICAgdGhpcy5kcmF3KClcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIHpvb20gb2JqZWN0IGFuZCB0aGVpciBleHRlbnRzXG4gIGxldCB6b29tID0gZDMuem9vbSgpXG4gICAgICAuc2NhbGVFeHRlbnQoWzEsIDJdKSAgLy8gVGhpcyBjb250cm9sIGhvdyBtdWNoIHlvdSBjYW4gdW56b29tICh4MC41KSBhbmQgem9vbSAoeDIwKVxuICAgICAgLnRyYW5zbGF0ZUV4dGVudChbWzAsIDBdLCBbd2lkdGggKiAxLjI1LCAyICogaGVpZ2h0XV0pXG4gICAgICAub24oXCJ6b29tXCIsIHpvb21lZClcblxuICAvLyBDYWxsIHRoZSB6b29tIG9iamVjdCBvbiB0aGUgZW50aXJlIFNWR1xuICB0aGlzLnN2Zy5jYWxsKHpvb20pXG4gIGRyYXdSYW5nZXMoZmcsIHRoaXMuZGF0YSwgdGhpcy5zY2FsZVgsIHRoaXMub3B0aW9ucylcbiAgdGhpcy5kcmF3KClcbn1cblxuY2hhcnQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcblxuICBsZXQgYXhpcyA9IHRoaXMuc3ZnLnNlbGVjdCgnLmF4aXMnKVxuICBsZXQgYXhpczIgPSB0aGlzLnN2Zy5zZWxlY3QoJy5heGlzMicpXG4gIGxldCBmZyA9IHRoaXMuc3ZnLnNlbGVjdCgnLmZnJylcbiAgZHJhd1llYXIoYXhpcywgdGhpcy5zY2FsZVgpXG4gIGRyYXdBeGlzKGF4aXMyLCB0aGlzLnNjYWxlWClcbiAgaWYodGhpcy5kYXRhKVxuICAgIHVwZGF0ZVJhbmdlcyhmZywgdGhpcy5kYXRhLCB0aGlzLnNjYWxlWCwgdGhpcy5zY2FsZVksIHRoaXMub3B0aW9ucylcbn1cbi8qKlxuICogUHJpdmF0ZSBmdW5jdGlvbiB0byBkcmF3IHRoZSBZZWFyIGF4aXMgXG4gKiBAcGFyYW0ge0dyYXBoaWN9IGcgXG4gKiBAcGFyYW0ge1NjYWxlfSBzY2FsZSBcbiAqL1xuZnVuY3Rpb24gZHJhd1llYXIoZywgc2NhbGUpIHtcbiAgZy5jYWxsKGQzLmF4aXNCb3R0b20oc2NhbGUpXG4gICAgICAgICAgIC50aWNrcyhkMy50aW1lWWVhci5ldmVyeSgxKSlcbiAgICAgICAgICAgLnRpY2tTaXplKDE1KVxuICAgICAgICAgICAudGlja0Zvcm1hdChkID0+IG1vbWVudChkKS5mb3JtYXQoJ1lZWVknKSkpXG4gICAgLmNhbGwoZyA9PiBnLnNlbGVjdChcIi5kb21haW5cIikucmVtb3ZlKCkpXG4gICAgLmNhbGwoZyA9PiBnLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAgIC5hdHRyKFwieVwiLCA1KVxuICAgICAgLmF0dHIoXCJkeFwiLCAyMCkpXG4gICAgLmNhbGwoZyA9PiBnLnNlbGVjdEFsbChcIi50aWNrIGxpbmVcIilcbiAgICAgIC5hdHRyKFwic3Ryb2tlLWRhc2hhcnJheVwiLCBcIjIsMlwiKVxuICAgICAgLmF0dHIoXCJzdHJva2Utb3BhY2l0eVwiLCAwLjUpKVxufVxuXG4vKipcbiAqIERyYXcgdGhlIHNlY29uZGFyeSBheGlzIFxuICogQHBhcmFtIHtHcmFwaGljfSBnIFxuICogQHBhcmFtIHtTY2FsZX0gc2NhbGUgXG4gKi9cbmZ1bmN0aW9uIGRyYXdBeGlzKGcsIHNjYWxlKSB7XG4gIGdcbiAgICAuY2FsbChkMy5heGlzQm90dG9tKHNjYWxlKVxuICAgICAgICAgICAgLnRpY2tTaXplKDUwMClcbiAgICAgICAgICAgIC50aWNrRm9ybWF0KGQgPT4gbW9tZW50KGQpLmZvcm1hdCgnTU1NJykpXG4gICAgICAgICAgICAudGlja1NpemVPdXRlcigtMzAwKVxuICAgIClcbiAgICAuY2FsbChnID0+IGcuc2VsZWN0KFwiLmRvbWFpblwiKS5yZW1vdmUoKSlcbiAgICAuY2FsbChnID0+IGcuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKVxuICAgICAgLmF0dHIoXCJzdHJva2Utb3BhY2l0eVwiLCAwLjUpXG4gICAgICAuYXR0cihcInN0cm9rZS1kYXNoYXJyYXlcIiwgXCIyLDJcIikpXG4gICAgLmNhbGwoZyA9PiBnLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAgIC5hdHRyKFwieVwiLCA4KVxuICAgICAgLmF0dHIoXCJkeFwiLCAxNSkpXG5cbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIFBvc2l0aW9ucyBvZiB0aGUgZXZlbnRzIGFuZCByYW5nZXNcbiAqIEBwYXJhbSB7R3JhcGhpY30gZmcgXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBcbiAqIEBwYXJhbSB7U2NhbGV9IHNjYWxlWCBcbiAqIEBwYXJhbSB7U2NhbGV9IHNjYWxlWSBcbiAqL1xubGV0IHVwZGF0ZVJhbmdlcyA9IChmZywgZGF0YSwgc2NhbGVYLCBzY2FsZVksIG9wdGlvbnMpID0+IHtcbiAgbGV0IHVwZGF0ZUxhbmUgPSAoZykgPT4ge1xuICAgIGcuYXR0cigndHJhbnNmb3JtJywgKHJhbmdlLCBpKSA9PiBgdHJhbnNsYXRlKCR7c2NhbGVYKHJhbmdlLnN0YXJ0KX0sICR7c2NhbGVZKGkgKiAob3B0aW9ucy5yYW5nZUhlaWdodCArIG9wdGlvbnMucmFuZ2VTcGFjaW5nKSl9KWApXG4gIH1cbiAgbGV0IHVwZGF0ZUJhciA9IChnKSA9PiB7XG4gICAgZy5hdHRyKCd3aWR0aCcsIHJhbmdlID0+IHNjYWxlWChyYW5nZS5lbmQpIC0gc2NhbGVYKHJhbmdlLnN0YXJ0KSlcbiAgfVxuXG4gIGZnXG4gICAgLnNlbGVjdEFsbCgnLmxhbmUnKVxuICAgIC5kYXRhKGRhdGEpXG4gICAgLnRyYW5zaXRpb24oKVxuICAgIC5kdXJhdGlvbigxMClcbiAgICAuY2FsbCh1cGRhdGVMYW5lKVxuXG4gIGZnXG4gICAgLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgLmRhdGEoZGF0YSlcbiAgICAudHJhbnNpdGlvbigpXG4gICAgLmR1cmF0aW9uKDEwKVxuICAgIC5jYWxsKHVwZGF0ZUJhcilcbn1cblxuLyoqXG4gKiBEcmF3IGFsbCB0aGUgZXZlbnRzIG9uIHRoZSBmb3JlZ3JvdW5kIGxheWVyXG4gKiBAcGFyYW0ge0dyYXBoaWN9IGZnIFxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgXG4gKiBAcGFyYW0ge1NjYWxlfSBzY2FsZSBcbiAqL1xubGV0IGRyYXdSYW5nZXMgPSAoZmcsIGRhdGEsIHNjYWxlLCBvcHRpb25zKSA9PiB7XG4gIGlmKCFkYXRhKSByZXR1cm5cblxuICBsZXQgZHJhd0JhciA9IChnKSA9PiB7XG4gICAgZy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgLmF0dHIoJ3J4Jywgb3B0aW9ucy5yYW5nZUNvcm5lclJhZGl1cylcbiAgICAgICAgLmF0dHIoJ3J5Jywgb3B0aW9ucy5yYW5nZUNvcm5lclJhZGl1cylcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgcmFuZ2UgPT4gc2NhbGUocmFuZ2UuZW5kKSAtIHNjYWxlKHJhbmdlLnN0YXJ0KSlcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHJhbmdlID0+IG9wdGlvbnMucmFuZ2VIZWlnaHQpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgcmFuZ2UgPT4gcmFuZ2UuY29sb3IpXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKCdmaWxsJywgXCJvcmFuZ2VcIik7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2N1cnNvcicsIFwicG9pbnRlclwiKTtcbiAgICAgICAgICBvcHRpb25zLm9uSG92ZXIocmFuZ2UpXG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2ZpbGwnLCByYW5nZS5jb2xvcik7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2N1cnNvcicsIFwiZGVmYXVsdFwiKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljaycsIG9wdGlvbnMub25DbGljaylcbiAgfVxuXG4gIGxldCBkcmF3TGFiZWw9IChnKSA9PiB7XG4gICAgbGV0IGxhYmVsID0gZy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7b3B0aW9ucy5yYW5nZUhlaWdodCArIDEyfSlgKVxuXG4gICAgbGFiZWwuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5jYWxsKFxuICAgICAgICBnID0+IGcuYXBwZW5kKCd0c3BhbicpXG4gICAgICAgICAgLnRleHQoIHJhbmdlID0+IG1vbWVudChyYW5nZS5zdGFydCkuZm9ybWF0KCdNTS9ZWVlZJykgKyBcIi1cIiArIG1vbWVudChyYW5nZS5lbmQpLmZvcm1hdCgnTU0vWVlZWScpIClcbiAgICAgICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIFwiQXJpYWxcIilcbiAgICAgICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCBcIjEycHhcIilcbiAgICAgICAgICAuYXR0cihcImZvbnQtd2VpZ2h0XCIsIFwiYm9sZFwiKVxuICAgICAgICAgIC5hdHRyKFwibGluZS1oZWlnaHRcIiwgXCIyMnB4XCIpXG4gICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwiYmxhY2tcIilcbiAgICAgIClcbiAgICAgIC5jYWxsKFxuICAgICAgICBnID0+IGcuYXBwZW5kKCd0c3BhbicpXG4gICAgICAgICAgLnRleHQoIHJhbmdlID0+IHJhbmdlLnRpdGxlIClcbiAgICAgICAgICAuYXR0cihcImR4XCIsIDUpXG4gICAgICAgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLCBcIkFyaWFsXCIpXG4gICAgICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgXCIxMnB4XCIpXG4gICAgICAgICAgLmF0dHIoXCJsaW5lLWhlaWdodFwiLCBcIjI0cHhcIilcbiAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJibGFja1wiKVxuICAgICAgKVxuICB9XG5cbiAgbGV0IGxhbmVzID0gZmcuc2VsZWN0QWxsKCcubGFuZScpLmRhdGEoZGF0YSlcbiAgbGFuZXMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsYW5lXCIpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIChyYW5nZSwgaSkgPT4gYHRyYW5zbGF0ZSgke3NjYWxlKHJhbmdlLnN0YXJ0KX0sICR7aSAqIChvcHRpb25zLnJhbmdlSGVpZ2h0ICsgb3B0aW9ucy5yYW5nZVNwYWNpbmcpfSlgKVxuICAgIC5jYWxsKGRyYXdCYXIpXG4gICAgLmNhbGwoZHJhd0xhYmVsKVxufSIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9kM19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9tb21lbnRfXzsiXSwic291cmNlUm9vdCI6IiJ9