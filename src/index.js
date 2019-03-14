import * as d3 from "d3";

var width = window.innerWidth,
  height = window.innerHeight;

var numNodes = 100;
var nodes = d3.range(numNodes).map(function(d) {
  return { radius: Math.random() * 25 };
});

var simulation = d3
  .forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-1))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force(
    "collision",
    d3.forceCollide().radius(function(d) {
      return d.radius;
    })
  )
  .on("tick", ticked);

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

  u.exit().remove();
}
