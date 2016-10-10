var svg = d3.select("body")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000)


var g = new dagre.graphlib.Graph({directed: true});

g.setGraph({})

g.setDefaultEdgeLabel(function() { return {}; });
g.setDefaultNodeLabel(function(){return {}; });

setupNodes();

function setupNodes() {
  d3.json('data/nodes.json', function(dat) {
    dat.map( function(d){
      g.setNode(d.id)
    })
    setupEdges();
  });
}

function setupEdges() {
  d3.json('data/links.json', function(dat) {
    dat.map( function(d){
      g.setEdge(d.source, d.target)
    })
    dagre.layout(g);
    drawGraph();
  });
}

function drawGraph() {

  nodesData = [];
  g.nodes().forEach(function(v) {
     nodesData.push(g.node(v))
});

  console.log(nodesData)

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodesData)
    .enter().append("circle")
    .attr("r", 3)
    .attr('cy', function(d){return d.y})
    .attr('cx', function(d){return d.x})
    //.attr("fill", function(d) { return color(d.id); })
    .attr("opacity", 1);



}
