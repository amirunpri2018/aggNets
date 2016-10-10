var svg = d3.select("body")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000)

var cy = cytoscape({})

var options = {
  // dagre algo options, uses default value on undefined
  nodeSep: undefined, // the separation between adjacent nodes in the same rank
  edgeSep: undefined, // the separation between adjacent edges in the same rank
  rankSep: undefined, // the separation between adjacent nodes in the same rank
  rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right
  minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
  edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: true, // whether to fit to viewport
  padding: 30, // fit padding
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  boundingBox: {x1: 10, y1: 10, x2: 100, y2:100}, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  ready: function(){}, // on layoutready
  stop: function(){} // on layoutstop
};

setupNodes();

function setupNodes() {
  d3.json('data/nodes.json', function(dat) {
    dat.map( function(d){
      cy.add({group: "nodes", data: {id: d.id}})
    })
    setupEdges();
  });
}

function setupEdges() {
  d3.json('data/links.json', function(dat) {
    dat.map( function(d){
      cy.add({group: "edges", data: {source: d.source, target: d.target}})
    })
    learnExtract();
  });
}

function learnExtract() {
  cy.elements().layout({ name: 'dagre', options: { padding: 1, boundingBox: {x1: 10, y1: 10, x2: 50, y2:50}} })
  //var layout = cy.makeLayout({ name: 'cose' });

  //layout.run();

  // some time later...
  //setTimeout(function(){
    //layout.stop();
    //extract = cy.elements().jsons();

    //console.log(extract)

  //  drawGraph()
  //}, 2000);

  extract = cy.elements().jsons();

  drawGraph()

}

function drawGraph() {

  nodesData = [];
  edgesData = [];
  extract.map(function(d){
    if(d.group == 'nodes'){
      nodesData.push({id: d.data.id, x: d.position.x, y: d.position.y})
    } else if(d.group == 'edges'){
      edgesData.push({source: d.data.source, target: d.data.target})
    }
  })

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
