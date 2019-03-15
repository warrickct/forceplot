import * as d3 from "d3";
// import * as _ from "lodash";

// var data = require("./abundance.json");
// console.log(data);

var width = window.innerWidth,
  height = window.innerHeight;

var numNodes = 200;
var nodes = d3.range(numNodes).map(function(d) {
  return { radius: Math.random() * 25 };
});

// nodes = data.sample_otu_data.map(so => {
//   return {};
// });

let maxMetric = d3.max(nodes, function(d) {
  return d.radius;
});

var simulation = d3
  .forceSimulation(nodes)
  .force(
    "x",
    d3
      .forceX(function(d) {
        return (d.radius / maxMetric) * width;
      })
      .strength(1)
  )
  .force("y", d3.forceY(height / 2))
  // .force("charge", d3.forceManyBody().strength(-1))
  // .force("center", d3.forceCenter(width / 2, height / 2))
  .force(
    "collision",
    d3.forceCollide(function(d) {
      return 5.5;
    })
  )
  .on("tick", ticked);

//add zoom capabilities
var svg = d3.select("svg");
var g = svg.append("g").attr("class", "everything");
var zoom_handler = d3.zoom().on("zoom", zoom_actions);
zoom_handler(svg);

// colors
var color = d3.scale.category20();
// .style("fill", function() {
//   return "hsl(" + Math.random() * 360 + ",100%,50%)";
// })

// tick stuff
function ticked() {
  var u = d3
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .selectAll("circle")
    .data(nodes);

  u.enter()
    .append("circle")
    .attr("r", 5)
    .merge(u)
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

  //add drag capabilities
  var drag_handler = d3
    .drag()
    .on("start", drag_start)
    .on("drag", drag_drag)
    .on("end", drag_end);
  drag_handler(u);

  u.exit().remove();
}

// drag functions
function drag_start(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

//make sure you can't drag the circle outside the box
function drag_drag(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function drag_end(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//Zoom functions
function zoom_actions() {
  g.attr("transform", d3.event.transform);
}
