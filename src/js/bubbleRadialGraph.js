  function bubbleRadialGraph(){
    console.log("generate bubble radial graph");

    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    innerRadius = 250,
    outerRadius = Math.min(width, height) * 0.6;
      var poolGradients = svg.append("defs").append("radialGradient")
          .attr("id", "gradientpool" )
          .attr("cx", "50%") //Move the x-center location towards the left
          .attr("cy", "50%") //Move the y-center location towards the top
          .attr("r", "50%"); //Increase the size of the "spread" of the gradient
      poolGradients.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", function(d) {
              return d3.rgb("#281437");
          });
//Then the actual color almost halfway
      poolGradients.append("stop")
          .attr("offset", "50%")

          .attr("stop-color", function(d) {
              return d3.rgb("#281437").brighter(2);
          })

//Finally a darker color at the outside
      poolGradients.append("stop")
          .attr("offset",  "100%")
          .style("opacity", 0)
          .attr("stop-color", function(d) {
              //return color(d.vote_average)
              return d3.rgb("#281437").darker(1);
          })

    
    var pool = svg.append('circle')
    .style('stroke-width', 0)
    .attr("fill",function(){return "url(#gradientpool)"})//"#281437")
    .attr("r",innerRadius)
    .attr("cy", 0.5*height)
    .attr("cx", 0.5*width);
    radius = innerRadius;

    // var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height /2 + ")");
    var star = svg.append('svg:image')
        .attr('x', -50)
        .attr('y', -50)
        .attr('width', 100)
        .attr('height', 100)
        .attr("xlink:href", "star.png")
        .attr("transform", "translate(" + width / 2 + "," + height /2 + ")");

    //Outbound

    // .attr({
    //     class: 'pool',
    //     r: innerRadius+10,
    //     cy: 0.5* width,
    //     cx: 0.5* height
    //     // transform: 'translate(' + width / 2 + ',' + height / 2 + ')'
    var padding = 1.5; // separation between same-color nodes

    var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

    var y = d3.scaleRadial()
    .range([innerRadius, outerRadius]);

    var z = d3.scaleOrdinal()
    .range(["#72818B", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


    d3.csv("data_bubble.csv", function(d, i, columns) {

      var radius=d.final_score;
          d.r = radius*1500;
          d.x = width/2+innerRadius*Math.sin( 2 * Math.PI*d.relative_position);
          d.y = height/2+innerRadius*Math.cos( 2 * Math.PI*d.relative_position);
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
    .range(['#9d0107', '#091592']);

        var defs = svg.append("defs");
        defs.selectAll(".patterns")
            .data(data, function(d) {
                return d})
            .enter().append("pattern")
            .attr("id", function(d) {return "actorbubble-" + (d.actor_id)})
            .attr("width", 1)
            .attr("height", 1)
            .append("svg:image")
            .attr("xlink:href", function(d) {
                return "crawler/"+d.actor_id+".jpg"
            }).attr("x", function(d){return -d.r*0.4})
            .attr("y", function(d){return -d.r*0.0833})
            .attr("width", function(d){return d.r*2.667})
            .attr("height", function(d){return d.r*2.667});


    var node = svg.append("g")//.attr("transform", "translate(" + width / 2 + "," + height /2 + ")")
     .selectAll("circle")
     .data(data)
     .enter().append("circle")
        .style("fill", function(d) {
            return "url(#actorbubble-"+d.actor_id+")"
        })
        .on("click", showActor)
        .attr("stroke-width", 2)
        .attr("stroke", function(d) { return genderColor(d.gender); });

    node.append("title")
            .text(function(d) { return d.name; });

  // bound force
  // var bound_force =  d3.forceSimulation()
  //   .force('charge', d3.forceManyBody()
  //   .strength(1000))
  //   // .size([width, height])
  //   .on('tick', boundtick)
  //   .nodes(data);


  var force = d3.forceSimulation()
    .force('collide', d3.forceCollide(d => d.r + padding)
    .strength(1))
    .on('tick', boundTick)
   .nodes(data);
  
  function boundTick(e) {
    node.attr("cx", function (d) { return d.x = pythagx(d.r, d.y, d.x); })
        .attr("cy", function (d) { return d.y = pythagy(d.r, d.x, d.y); })
        .attr("r", function(d) { return d.r; });
  }

        function pythagx(r, b, coord) {
            var length = Math.sqrt(Math.pow(Math.abs(b-height/2)+r,2)+Math.pow(Math.abs(coord-width/2)+r,2));

            if (length>radius){
                var angle = Math.acos((coord-width/2)/length);
                if (b-height/2<0){
                    if (coord-width/2<0){
                        return width/2 - (radius-r-10) * Math.cos(angle+Math.PI) }
                    else{return width/2 + (radius-r-10) * Math.cos(angle) }
                }else{
                    if (coord-width/2>0){
                        return width/2 + (radius-r-10) * Math.cos(angle) }
                    else{return width/2 + (radius-r-10) * Math.cos(angle) }}
            }
            return coord;
        }
        function pythagy(r, b, coord) {
            var length = Math.sqrt(Math.pow(Math.abs(b-width/2)+r,2)+Math.pow(Math.abs(coord-height/2)+r,2));

            if (length>radius){

                var angle = Math.acos((b-width/2)/length);
                if (b-width/2<0){
                    if (coord-height/2<0){
                        return height/2 - (radius-r-10) * (Math.sin(angle)) }
                    else{return height/2 + (radius-r-10) * (Math.sin(angle)) }
                }else{
                    if (coord-height/2>0){
                        return height/2 + (radius-r-10) * (Math.sin(angle)) }
                    else{return height/2 - (radius-r-10) * (Math.sin(angle)) }
                }
            }
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
      function showActor(d){

        console.log("show actor", d);
        svg.selectAll('circle').remove();
        scaleRadialGraph();
        postActorData(d.actor_id*1);
        //postActorData(d.actor_id);

    }

}

    //showActor function in bubble Radial graph







