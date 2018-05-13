function forceDirectGraph(inputdata){
  var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
  console.log(typeof inputdata);
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(150))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));
  //parse input array to JSON format
  //var data = JSON.parse(arraydata); 
  console.log(typeof inputdata)
  var haha = { "name":"John", "age":30, "car":null };
  console.log(haha);
  var graph = inputdata;
  // d3.json(inputdata, function(error, graph) {
    console.log(graph);
    //if (error) throw error;

    var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", 1)
    .attr("stroke", function(d){return color(d.value);})


    var node0 = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 15)
    .attr("fill", function(d) { return color(d.gender); })
    .filter(function (d, i) { return i === 0;})
         // put all your operations on the second element, e.g.
    // .append('h1').text('foo'); 
    // .on("click", nextActor)
    .call(d3.drag()
     .on("start", dragstarted0)
     .on("drag", dragged0)
     .on("end", dragended0));


    var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 15)
    .attr("fill", function(d) { return color(d.gender); })
    .filter(function (d, i) { return i != 0;})
         // put all your operations on the second element, e.g.
    // .append('h1').text('foo'); 
    .on("click", nextActor)
    .call(d3.drag()
     .on("start", dragstarted)
     .on("drag", dragged)
     .on("end", dragended));


    
    
    node.append("title")
    .text(function(d) { return d.id; });



    simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

    simulation.force("link")
    .links(graph.links);

    function ticked() {
      link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
      node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
      node0
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    }

  // });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();

    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    // if(a ===0) {
    //   d.fx = d.x;
    //   d.yx= d.y;



    d.fx = d3.event.x;
    d.fy = d3.event.y;
  
  }

  function dragged0(d){}
  function dragstarted0(d){}
    function dragended0(d)   {}



  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
    d.fy = null;
  }
  //the function to jump to the next actor
  function nextActor(d){
    
  }

}