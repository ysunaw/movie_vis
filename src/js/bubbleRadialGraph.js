  function bubbleRadialGraph(){
    console.log("generate bubble radial graph");

    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    innerRadius = 250,
    outerRadius = Math.min(width, height) * 0.6;
  
    
    var pool = svg.append('circle')
    .style('stroke-width', 10)
    .attr("fill","white")
    .attr("r",innerRadius)
    .attr("cy", 0.5*height)
    .attr("cx", 0.5*width);
    // radius = width / 2,
    var hyp2 = Math.pow(innerRadius*2, 2);


    //Outbound

    // .attr({
    //     class: 'pool',
    //     r: innerRadius+10,
    //     cy: 0.5* width,
    //     cx: 0.5* height
    //     // transform: 'translate(' + width / 2 + ',' + height / 2 + ')'
    



    var padding = 1.5, // separation between same-color nodes
    clusterPadding = 10, // separation between different-color nodes
    maxRadius = 100;

    var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

    var y = d3.scaleRadial()
    .range([innerRadius, outerRadius]);

    var z = d3.scaleOrdinal()
    .range(["#72818B", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


    d3.csv("data_bubble.csv", function(d, i, columns) {

      var radius=d.final_score;
          d.r = radius*1000;
          d.x = innerRadius*0.7*Math.sin( 2 * Math.PI*d.relative_position);
          d.y = innerRadius*0.7*Math.cos( 2 * Math.PI*d.relative_position);
      return d;
      
    }, function(error, data) {
      if (error) throw error;
      data.sort(function(a, b) { return b[data.columns[2]] -  a[data.columns[2]]; });
      //console.log( b[data.columns[6]] -  a[data.columns[6]]);
      x.domain(data.map(function(d) { return d.State; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);
      z.domain(data.columns.slice(1));

    var genderColor = d3.scaleOrdinal()
    .domain([1,2])
    .range(['#4F57AA', '#FE3942']);

    var node = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height /2 + ")").selectAll("circle")
     .data(data)
     .enter().append("circle")
     .style("fill", function(d) {return genderColor(d.gender); });


  // bound force
  // var bound_force =  d3.forceSimulation()
  //   .force('charge', d3.forceManyBody()
  //   .strength(1000))
  //   // .size([width, height])
  //   .on('tick', boundtick)
  //   .nodes(data);


  var force = d3.forceSimulation()
    .force('collide', d3.forceCollide(d => d.r + padding)
    .strength(0.1))
    .on('tick', layoutTick)
   .nodes(data);
  
  function boundtick(e) {
    node.attr("cx", function (d) { return d.x = pythagy(d.r, d.y-height/2, d.x=width/2); })
        .attr("cy", function (d) { return d.y = pythagx(d.r, d.x=width/2, d.y-height/2); })
        .attr("r", function(d) { return d.r; });
  }


function pythagx(r, b, coord) {
    

    // force use of b coord that exists in circle to avoid sqrt(x<0)
    b = Math.min(width - r , Math.max(r , b));

    var b2 = Math.pow((b - innerRadius), 2),
        a = Math.sqrt(hyp2 - b2);

    // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
    coord = Math.max(innerRadius - a + r ,
                Math.min(a + innerRadius - r , coord));

    return coord;
}
function pythagy(r, b, coord) {
    

    // force use of b coord that exists in circle to avoid sqrt(x<0)
    b = Math.min(height - r , Math.max(r , b));

    var b2 = Math.pow((b - innerRadius), 2),
        a = Math.sqrt(hyp2 - b2);

    // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
    coord = Math.max(innerRadius - a + r ,
                Math.min(a + innerRadius - r , coord));

    return coord;
}


function layoutTick(e) {
  node
      .attr("cx", function(d) {  return d.x ; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; });
}


      var yAxis = svg.append("g")
      .attr("text-anchor", "end");
  });

}







