import * as d3 from 'd3'
import moment from 'moment'
import { schemeDark2 } from 'd3';



export function chart(container, width, height, options) {
  let that = this

  let origScaleX = d3.scaleTime()
    .domain([new Date(2017, 10, 15), new Date(2019, 2, 15)])
    .range([0, width]);

  let origScaleY = d3.scaleLinear()
    .domain([0, height])
    .range([0, height]);

  this.scaleX = origScaleX
  this.scaleY = origScaleY

  let svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    // .style("border", "2px solid orange")

  let axis = svg.append("g")

  svg.append("g").append('line')
    .attr('x1', 0)
    .attr('y1', 16)
    .attr('x2', width)
    .attr('y2', 16)
    .attr("stroke-width", 1 )
    .attr("stroke", 'black' )
    .attr("stroke-opacity", 0.5)

  let axis2 = svg.append("g")
    .attr('transform', 'translate(0, 17)')

  svg.append("clipPath")       // define a clip path
    .attr("id", "main-area") // give the clipPath an ID
  .append("rect")          // shape it as an ellipse
    .attr("width", width)         // set the x radius
    .attr("height", height);         // set the y radius

  svg.append("g")
    .attr('transform', 'translate(0, 60)') 
    .attr("clip-path", "url(#main-area)") // clip the rectangle
    .attr("class", "fg")

  let updateChart = () => {
    this.scaleX = d3.event.transform.rescaleX(origScaleX);
    let k = d3.event.transform.k
    d3.event.transform.k = 1;
    this.scaleY = d3.event.transform.rescaleY(origScaleY);
    d3.event.transform.k = k;
    drawYear(axis, this.scaleX)
    drawAxis(axis2, this.scaleX)
    updatePosition(svg, that.data, this.scaleX, this.scaleY)

  }

  let zoom = d3.zoom()
      .scaleExtent([.25, 2])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]])
      .on("zoom", updateChart)

  svg.call(zoom)

  drawYear(axis, this.scaleX)
  drawAxis(axis2, this.scaleX)
  this.width = width
  this.height = height
  this.svg = svg 
}

chart.prototype.setData = function(data) {
  this.data = data
  let fg = this.svg.select('.fg')

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
    .call(g => g.select(".domain").remove())
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
    .duration(10)
    .call(updateLane)

  fg
    .selectAll('.bar').data(data)
    .transition()
    .duration(10)
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
        .on("mouseover", function(range) {
          d3.select(this).attr('fill', "orange");
          d3.select(this).attr('cursor', "pointer");
        })
        .on("mouseout", function(range) {
          d3.select(this).attr('fill', range.color);
          d3.select(this).attr('cursor', "default");
        })
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

    // TODO this will add a solid background behind the text for better readability
    // let box = textNode.node().getBBox();
    // label.insert('rect', 'text')
    //   .attr('width', box.width)
    //   .attr('height', box.height)
    //   .attr('fill', 'white')
    //   .attr('y', '10')
   
  }

  let lanes = fg.selectAll('.lane').data(data)

  lanes.enter().append('g')
    .attr("class", "lane")
    .attr('transform', (range, i) => `translate(${scale(range.start)}, ${i * 40})`)
    .call(drawBar)
    .call(drawLabel)
}
