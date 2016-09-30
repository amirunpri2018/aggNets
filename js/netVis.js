

var svg = d3.select("body")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000)
  
  
var width = 1000;
var height = 1000;

var click = 0;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var circleRadius = 8;
var linkLength = 50;

loadNodes();

function loadNodes(){
  d3.json('data/nodes.json', function(dat) {
    nodesData = dat;
    loadLinks();
  })
}

function loadLinks() {
    d3.json('data/links.json', function(dat) {
      linksData = dat;
      createLinks(linksData);
    })
}




function createLinks(data){

  //create aggregated data - use this for the new links
  var unique = _.groupBy(data, function(value) {
    return value.source + '#' + value.target;
  });
  
  links = _.map(unique, function(group){
    var value = 0
    _.map(group, function(sub) {
      return value+=sub.value
    })
    return {
        source: group[0].source,
        target: group[0].target,
        value: value,
    }
  });  
  
  nodes = nodesData;
  drawGraph(nodes, links);
}

function createSubGraph(sourceSelect, targetSelect){
  //subset graph to be only nodes selected
  var subNodes = nodesData.filter(function(d) {
    return d.id == sourceSelect || d.id == targetSelect
  })
  
  var subLinks = linksData.filter(function(d) {
    return (d.source == sourceSelect && d.target == targetSelect) || (d.source == targetSelect && d.target == sourceSelect)
  })
    
  
  drawGraph(subNodes, subLinks);
  
}

function createSubGraphNodes(idSelect){
  
  var subLinks = linksData.filter(function(d) {
    return d.source == idSelect || d.target == idSelect;
  })
  
  var newNodes = [];
  
  for(var i = 0; i < subLinks.length; i ++){
    if(!newNodes.contains(subLinks[i].source)){
      newNodes.push(subLinks[i].source)
    }
  }
  
  for(var i = 0; i < subLinks.length; i ++){
    if(!newNodes.contains(subLinks[i].target)){
      newNodes.push(subLinks[i].target)
    }
  }
  
  nodesFinal = [];
  newNodes.map(function(d){
    nodesFinal.push({id:d})
  })      
  
  drawGraph(nodesFinal, subLinks);
  
}




function drawGraph(nodes, links){
  
  
  d3.selectAll('g').remove();
  
  for (var i=0; i<links.length; i++) {
    if (i != 0 &&
        links[i].source == links[i-1].source &&
        links[i].target == links[i-1].target) {
            links[i].linknum = links[i-1].linknum + 1;
        }
    else {links[i].linknum = 1;};
  };
  
  var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force('collide', d3.forceCollide(40));
  
  
  var path = svg.append("svg:g").selectAll("path.link")
    .data(links)
  .enter().append("svg:path")
    .attr("class", function(d) { return "link"; })
    .attr("stroke-opacity", .5)
    .attr("stroke-width", function (d) {return Math.sqrt(d.value)/2})
    .on('click', function(d) { 
        createSubGraph(d.source.id, d.target.id)
    });
    
    
  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", circleRadius)
    .attr("fill", function(d) { return color(d.id); })
    .attr("opacity", 1)
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
    .on('click', function(d){
      createSubGraphNodes(d.id);
    })
          
  node.append("title")
  .text(function(d) { return d.id; });
  
  svg.append("svg:defs").selectAll("marker")
    .data(["arrow"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 13)
    .attr("refY", -.5)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L5,0L0,5");
  
  
  var markerPath = svg.append("svg:g").selectAll("path.marker")
    .data(links)
  .enter().append("svg:path")
    .attr("class", function(d) { return "marker_only"; })
    .attr("stroke-opacity", 0)
    .attr("marker-end", function(d) { return "url(#arrow)"});
    
  var text = svg.append("svg:g").selectAll("g")
  .data(nodes)
  .enter().append("svg:g");

  // A copy of the text with a thick white stroke for legibility.
  text.append("svg:text")
      .attr("x", 8)
      .attr("y", ".31em")
      .attr("class", "shadow")
      .attr('font-size', '6pt')
      .text(function(d) { return d.id; });
  
  text.append("svg:text")
      .attr("x", 8)
      .attr("y", ".31em")
      .attr('font-size', '6pt')
      .text(function(d) { return d.id; });
          
  simulation
  .nodes(nodes)
  .on("tick", ticked);
  
  simulation.force("link")
  .links(links)
  .distance(linkLength);
  
  
  function ticked() {
    
          
    node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
    
    text.attr("transform", function(d) {
      return "translate(" + (d.x+5) + "," + (d.y+10) + ")";
    });


    path
    .attr("d", function(d) {
      var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = 250/d.linknum + 50;      
      
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    });
    
      
    markerPath
    .attr("d", function(d) {
      var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = 250/d.linknum + 50;      
      
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    });

  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
    
  
}


Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};
