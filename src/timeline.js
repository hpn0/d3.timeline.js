import * as d3 from 'd3'
import _ from 'lodash'
import moment from 'moment'
import { line, lab, interpolateCubehelixLong } from 'd3';


export function chart(container, width, height) {
  let that = this

  let timeScale = d3.scaleTime()
    .domain([new Date(2018, 0, 1), new Date(2019, 0, 1)])
    .range([0, width]);

  let scaleX = timeScale 

  let scaleY = d3.scaleLinear()
    .domain([0, height])
    .range([0, height]);

  let svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "2px solid orange")

  let axis = svg.append("g")
  let axis2 = svg.append("g")
    .attr('transform', 'translate(0, 17)')

  svg.append("clipPath")       // define a clip path
    .attr("id", "main-area") // give the clipPath an ID
  .append("rect")          // shape it as an ellipse
    .attr("width", width)         // set the x radius
    .attr("height", height);         // set the y radius


  let updateChart = () => {
    let newScaleX = d3.event.transform.rescaleX(timeScale);
    drawYear(axis, newScaleX)
    drawAxis(axis2, newScaleX)
    updatePosition(svg, that.data, newScaleX, scaleY)
    this.scaleX = newScaleX;
  }

  let zoom = d3.zoom()
      .scaleExtent([.25, 2])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on("zoom", updateChart);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(zoom);

  drawYear(axis, scaleX)
  drawAxis(axis2, scaleX)
  this.width = width
  this.height = height
  this.svg = svg 
  this.scaleX = scaleX
}

chart.prototype.setData = function(data) {
  this.data = data

  let fg = this.svg.append("g")
    .attr('transform', 'translate(0, 60)') 
    .attr("clip-path", "url(#main-area)") // clip the rectangle
  drawForeground(fg, this.data, this.scaleX)
}

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
function drawAxis(g, scale) {
  g
    .call(d3.axisBottom(scale)
            .tickSize(500)
            .tickFormat(d => moment(d).format('MMM'))
            .tickSizeOuter(-300)
    )
    .call(g => g.select(".domain")
      // .attr("stroke-dasharray", "10,2")
      .attr("stroke-opacity", 0.5))
    .call(g => g.selectAll(".tick line")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "2,2"))
    .call(g => g.selectAll(".tick text")
      .attr("y", 8)
      .attr("dx", 15))
}


let updatePosition = (fg, data, scaleX, scaleY) => {
  let updateLane = (g) => {
    g.attr('transform', (range, i) => `translate(${scaleX(range.start)}, ${scaleY(i * 40)})`)
  }
  let updateBar = (g) => {
    g.attr('width', range => scaleX(range.end) - scaleX(range.start))
  }

  fg
    .selectAll('.lane').data(data)
    .transition()
    .call(updateLane)

  fg
    .selectAll('.bar').data(data)
    .transition()
    .call(updateBar)
}

let drawForeground = (fg, data, scale) => {
  if(!data) return


  let drawBar = (g) => {
    g.append('rect')
        .attr('class', 'bar')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', range => scale(range.end) - scale(range.start))
        .attr('height', 8)
        .attr('fill', range => range.color)
  }

  let drawLabel= (g) => {
    
    let label = g.append('g')
      .attr('class', 'label')

    let textNode = label.append('text')
      .attr('transform', 'translate(0, 22)')
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

    let box = textNode.node().getBBox();
    label.insert('rect', 'text')
      .attr('width', box.width)
      .attr('height', box.height)
      .attr('fill', 'white')
      .attr('y', '10')
   
  }

  let lanes = fg.selectAll('.lane').data(data)

  lanes.enter().append('g')
    .attr("class", "lane")
    .attr('transform', (range, i) => `translate(${scale(range.start)}, ${i * 40})`)
    .call(drawBar)
    .call(drawLabel)
}
