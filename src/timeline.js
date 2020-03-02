import * as d3 from 'd3'
import moment from 'moment'

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
export function chart(container, data, options) {
  // Define the original scale, original scales will be used for zoom transformation
  this.options = {...defaultOption, ...options}
  this.data = data
  let width = this.options.width
  let height = this.options.height

  let left = this.data.map(item => item.start).reduce( (prev, cur) => Math.min(prev, cur))
  let right = this.data.map(item => item.end).reduce( (prev, cur) => Math.max(prev, cur))

  left = moment(left).add('month', -2)
  right = moment(right).add('month', 2)

  let origScaleX = d3.scaleTime()
    .domain([left, right])
    .range([0, width]);

  let origScaleY = d3.scaleLinear()
    .domain([0, height])
    .range([20, height]);

  // The current Scales after transformation
  this.scaleX = origScaleX
  this.scaleY = origScaleY

  // Create the root SVG object within the given HTML element container
  this.svg = d3.select(container)
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
    this.scaleX = d3.event.transform.rescaleX(origScaleX);

    // Prevent Vertical scaling
    let k = d3.event.transform.k
    d3.event.transform.k = 1;
    this.scaleY = d3.event.transform.rescaleY(origScaleY);
    d3.event.transform.k = k;
    this.draw()
  }

  // Create a zoom object and their extents
  let zoom = d3.zoom()
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
  g.call(d3.axisBottom(scale)
           .ticks(d3.timeYear.every(1))
           .tickSize(15)
           .tickFormat(d => moment(d).format('YYYY')))
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
    .call(d3.axisBottom(scale)
            .tickSize(500)
            .tickFormat(d => moment(d).format('MMM'))
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
          d3.select(this).attr('fill', "orange");
          d3.select(this).attr('cursor', "pointer");
          options.onHover(range)
        })
        .on("mouseout", function(range) {
          d3.select(this).attr('fill', range.color);
          d3.select(this).attr('cursor', "default");
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
          .text( range => moment(range.start).format('MM/YYYY') + "-" + moment(range.end).format('MM/YYYY') )
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