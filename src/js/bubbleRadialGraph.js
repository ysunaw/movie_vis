  function bubbleRadialGraph(){
    console.log("generate scale radial graph");
    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    innerRadius = 250,
    outerRadius = Math.min(width, height) * 0.6,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height /2 + ")");


    var margin = 30,
    w = 500 - margin * 2,
    h = w,
    radius = w / 2,
    strokeWidth = 4,
    hyp2 = Math.pow(radius, 2),
    nodeBaseRad = 5;

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

    //Outbound
    var pool = svg.append('circle')
    .style('stroke-width', strokeWidth * 2)
    .attr({
        class: 'pool',
        r: radius,
        cy: 0,
        cx: 0,
        transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
    });

    d3.csv("data_bubble.csv", function(d, i, columns) {
      //console.log(d.relative_position);
      // for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
      //   d.total = t;
      var radius=d.final_score;
          d.r = radius*1000;
          d.x = width/2*0.8*Math.sin( 2 * Math.PI*d.relative_position);
          d.y = width/2 *0.8*Math.cos( 2 * Math.PI*d.relative_position);
      console.log(d) 
      return d;
      
    }, function(error, data) {
      if (error) throw error;
      console.log(data.columns.slice(1));
      data.sort(function(a, b) { return b[data.columns[2]] -  a[data.columns[2]]; });
      //console.log( b[data.columns[6]] -  a[data.columns[6]]);
      x.domain(data.map(function(d) { return d.State; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);
      z.domain(data.columns.slice(1));

    var genderColor = d3.scaleOrdinal()
    .domain([1,2])
    .range(['#4F57AA', '#FE3942']);

    // var node_actor = g.append("g")
    // .attr("class", "nodes")
    // .selectAll("circle")
    // .data(data)
    // .enter().append("circle")
    // .attr("r", function(d){return d.final_score * 2000 })
    // .attr("fill", function(d) { return genderColor(d.gender); }) // gender: 2 if male, 2 if female
    // .attr("transform", function(d) { 
    //   console.log(d.relative_position);
    //   return "rotate(" + ((d.relative_position* 2 * Math.PI + Math.PI+ x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });
    //var nodes = 
    var node = g.selectAll("circle")
     .data(data)
     .enter().append("circle")
     //.attr("r", function(d){return d.r  })
     // .attr("x", function(d){return width/2+d.r *Math.sin( 2 * Math.PI*d.relative_position);})
     // .attr("y", function(d){return width/2+d.r *Math.cos( 2 * Math.PI*d.relative_position);})
     .style("fill", function(d) {return genderColor(d.gender); });
console.log(node);
    // var n = 200, // total number of nodes
    //     m = 1; // number of distinct clusters


    // var nodes = d3.range(n).map(function() {
    //   var i = Math.floor(Math.random() * m),
    //   r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
    //   d = {
    //     cluster: 0,
    //     radius: r,
    //     x: Math.cos(width/2*r / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
    //     y: Math.sin(width/2*r / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
    //   };
  //if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  // return d;
// });
  

var force = d3.forceSimulation()
  .force('collide', d3.forceCollide(d => d.r + padding)
    .strength(0.7))

  .on('tick', layoutTick)
  .nodes(data);
  
// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);



  
function layoutTick(e) {
  node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; });
}


      var yAxis = g.append("g")
      .attr("text-anchor", "end");
  });

}







