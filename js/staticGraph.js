
var width = 960,
    height = 960;

var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

var color = d3.scaleOrdinal(d3.schemeCategory20);

readLinks()

function readLinks(){
  d3.json('data/links.json', function(dat) {
    linksData = dat;

    //for use in the lookup function
    num = 0;
    linksData.map(function(d){
      d.linkID = num
      num += 1
    })

    readNodes();
  })
}

function readNodes(){
  d3.json('data/nodes.json', function(dat) {
    nodesData = dat;
    drawGraph();
  })
}

function drawGraph(){
  //console.log(linksData)
  //console.log(nodesData)

  for (var i=0; i<linksData.length; i++) {
    if (i != 0 &&
        linksData[i].source == linksData[i-1].source &&
        linksData[i].target == linksData[i-1].target) {
            linksData[i].linknum = linksData[i-1].linknum + 1;
        }
    else {linksData[i].linknum = 1;};
  };

  svg.selectAll("path")
      .data(linksData)
    .enter().append("path")
    .attr("class", function(d) { return 'link'+d.linkID; })
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", function (d) {return Math.sqrt(d.value)/2})
    .attr("fill", "none")
    .attr("stroke", "#666")
    .attr("d", function(d) {
      var dx = (d.targetX*10+400) - (d.sourceX*10+400),
      dy = (d.targetY*10+400) - (d.sourceY*10+400),
      dr = 300/d.linknum + 50;

      return "M" + (d.sourceX*10+400) + "," + (d.sourceY*10+400) + "A" + dr + "," + dr + " 0 0,1 " + (d.targetX*10+400) + "," + (d.targetY*10+400);
    })


  svg.selectAll("circle")
    .data(nodesData)
  .enter().append("circle")
    .attr('class', function(d) { return d.id.replace(/ /g,'').replace(/\./g,'')})
    .attr("fill", function(d) { return color(d.id); })
    .attr("cx", function(d) { return d.x*10 + 400; })
    .attr("cy", function(d) { return d.y*10 + 400; })
    .attr("r", 5)
    .on('mouseover', function(){
      findConnections(d3.select(this).attr("class"));

      d3.selectAll('circle').attr('fill-opacity', 0.2);
      for(i = 0; i < nodeNames.length; i++){
        d3.select("."+nodeNames[i].replace(/ /g,'').replace(/\./g,'')).attr('fill-opacity', 1)
      }

      d3.selectAll('path').attr('stroke-opacity', 0);
      for(i = 0; i < linkIDs.length; i++){
        d3.select(".link"+linkIDs[i]).attr('stroke-opacity', 0.5)
      }

      d3.selectAll('text').attr('opacity', 0.2);
      for(i = 0; i < nodeNames.length; i++){
        d3.select("g."+nodeNames[i].replace(/ /g,'').replace(/\./g,'')).selectAll('text').attr('opacity', 1)
      }

    })
    .on('mouseout', function(){
      d3.selectAll('path').attr("stroke-opacity", 0.5);
      d3.selectAll('circle').attr("fill-opacity", 1);
      d3.selectAll('text').attr('opacity', 1);
    });

  var text = svg.append("svg:g").selectAll("g")
  .data(nodesData)
  .enter().append("svg:g").attr("class", function(d){return d.id.replace(/ /g,'').replace(/\./g,'')});

  text.append("svg:text")
      .attr("x", 8)
      .attr("y", ".31em")
      .attr("class", "shadow")
      .attr('font-size', '6pt')
      .text(function(d) { return d.id; })
      .attr("transform", function(d) {
        return "translate(" + (d.x*10+400) + "," + (d.y*10+405) + ")";
      });

  text.append("svg:text")
      .attr("x", 8)
      .attr("y", ".31em")
      .attr('font-size', '6pt')
      .text(function(d) { return d.id; })
      .attr("transform", function(d) {
        return "translate(" + (d.x*10+400) + "," + (d.y*10+405) + ")";
      });


}

function findConnections(d){
  var selected = d;

  //find links with association to selected team
  subLinks = linksData.filter(function(el){
    return el.source.replace(/ /g,'').replace(/\./g,'') == selected || el.target.replace(/ /g,'').replace(/\./g,'') == selected
  })

  linkIDs = []
  subLinks.map(function(el){
    linkIDs.push(el.linkID)
  })

  nodeNames = subLinks.map(function(el){
    return el.target
  })
  subLinks.map(function(el){
    nodeNames.push(el.source)
  })

}
