function forceDirectGraph(inputdata){
      var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height")

  var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(160)) // the length of the link
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));
  //parse input array to JSON format
  //var data = JSON.parse(arraydata); 
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  //the color for links
  var linkColor = d3.scaleOrdinal()
    .range([]);
  var genderColor = d3.scaleOrdinal()
    .domain([1,2])
    .range(['#4F57AA', '#FE3942']);
  var graph = inputdata;
  // d3.json(inputdata, function(error, graph) {
    console.log(graph);
    //if (error) throw error;
    var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.movies)
    .enter().append("line")
    .attr("stroke-width", 4)
    .attr("stroke", function(d){return color(d.value);});

    // the first node lying in the center
    //representing the actor whose network is currently showing
    var node0 = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.actors)
    .enter().append("circle")
    .attr("r", 30)
    .attr("fill", function(d) { return genderColor(d.gender); }) // gender: 2 if male, 2 if female
    .filter(function (d, i) { return i === 0;});

    //rest of the nodes; can be dragged
    var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.actors)
    .enter().append("circle")
    .attr("r", 15)
    .attr("fill", function(d) { return genderColor(d.gender); })
    .filter(function (d, i) { return i != 0;})
    .on("click", nextActor)
    .attr("id","nodes")
    .call(d3.drag()
     .on("start", dragstarted)
     .on("drag", dragged)
     .on("end", dragended));


    
    // append the title of each node
    node.append("title")
    .text(function(d) { return d.name; });


    simulation
    .nodes(graph.actors)
    .on("tick", ticked);

    simulation.force("link")
    .links(graph.movies);

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

    d.fx = d3.event.x;
    d.fy = d3.event.y;
  
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
    d.fy = null;
  }
  //the function to jump to the next actor
  //on clicking
  function nextActor(d){
    svg.selectAll("*").remove();
    scaleRadialGraph();
    postActorData(d.actor_id);

  }  

}
