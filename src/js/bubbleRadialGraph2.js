function bubbleRadialGraph(input_bubble_data){

    //var graph = JSON.parse(input_bubble_data);
    //console.log(typeof graph);
    var svg = d3.select("#Bubblesvg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        innerRadius = 250,
        outerRadius = Math.min(width, height) * 0.6;
    var padding = 1.5; // separation between same-color nodes

    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0);

    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius]);

    var z = d3.scaleOrdinal()
        .range(["#72818B", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var graph = input_bubble_data;

    // d3.json("data_bubble.json", function(error,graph) {
    //input_bubble_data = graph;
    //console.log(graph.length);
    for (i = 0; i < graph.length; ++i) {

        graph[i]["x"] = width / 2 + innerRadius * Math.sin(2 * Math.PI * graph[i].relative_position);
        graph[i]["y"] = height / 2 + innerRadius * (-Math.cos(2 * Math.PI * graph[i].relative_position));
        graph[i]["radius"] = graph[i].final_score * 7.5* (graph.length+400/graph.length);
    }
    var data = graph;
    var genderColor = d3.scaleOrdinal()
        .domain([1,2])
        .range(['#9d0107', '#091592']);
    var s = 0.02;
    // var forceX = d3.forceX(width/2).strength(s);
    // var forceY = d3.forceY(height/2).strength(s);
    var force = d3.forceSimulation(data)
        // .force('x', forceX)
        // .force('y', forceY)
        .force('collide', d3.forceCollide(d => d.radius + padding)
            .strength(1))
        .on('tick', boundTick)
        // .nodes();



    var defs = svg.select("defs");
    //console.log(svg.selectAll(".patterns"));
    defs.selectAll(".patterns")
        .data(data, function(d){return d.actor_id})//, function(d) {
        // return d})
        .enter().append("pattern")
        .attr("class","actorPics")
        .attr("id", function(d) { return "actorbubble-" + (d.actor_id)})
        .attr("width", 1)
        .attr("height", 1)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 225 225")
        .append("svg:image")
        .attr("xlink:href", function(d) {
            return "crawler/"+d.actor_id+".jpg"
        });
    // .attr("width", function(d){console.log(d.radius);return d.radius*10})
    // .attr("height", function(d){return d.radius*1000});

        var t = d3.transition()
            .duration(720);

    defs.selectAll(".patterns")
        .data(data, function(d){return d.actor_id}).exit().remove()



    defs.selectAll(".patterns")
        .data(data, function(d){return d.actor_id})
        .attr("class", "update")
        .attr("y", 0)
        .style("fill-opacity", 1)
        .transition(t)
        .attr("x", function(d, i) { return i * 32; });

    svg.select("g").selectAll("circle").data(data, function(d){return d.actor_id})
        .exit()
        .attr("class", "exit")
        .transition(t)
        .attr("r", 0)
        .style("fill-opacity", 1e-6).remove()
    svg.select("g").selectAll("circle").data(data, function(d){return d.actor_id})
        .attr("class", "update")
        //.attr("y", 0)
        //.style("fill-opacity", 1)
        .transition(t)
        .attr("cx", function (d) { return d.x = pythagx(d.radius, d.y, d.x); })
        .attr("cy", function (d) { return d.y = pythagy(d.radius, d.x, d.y); })
        .attr("r", function(d) { if (d.radius>innerRadius/2){return innerRadius/2.5} else{return d.radius}; });

    var node = svg.select("g")//.attr("transform", "translate(" + width / 2 + "," + height /2 + ")")
        .selectAll("circle")
        .data(data, function(d){return d.actor_id})
        .enter().append("circle")
        .attr("r",0)
        .attr("cx",function(d) {return d.x})
        .attr("cy",function(d) {return d.y})
        .style("fill", function(d) {
            return "url(#actorbubble-"+d.actor_id+")"
        })
        .attr("id","nodeBubbles")
        .on("mouseover", function(d) {
            d3.selectAll("#biosvgpic").remove();
            d3.selectAll("#biosvgbio").remove();
            biographyWindow(d.actor_id);
        })
        .on("mouseout", function(d) {
            d3.selectAll("#biosvgpic").remove();
            d3.selectAll("#biosvgbio").remove();
        })
        .on("click", function(d){showActor(d);})
        //.on("click", showActor)
        .attr("stroke-width", 2)
        .attr("stroke", function(d) { return genderColor(d.gender); })
        // .transition(t)
        // .attr("r", function(d){return d.radius});

            // .transition(t)
            // .attr("r", function(d){return d.radius})
            // .style("fill-opacity", 1)
        // .transition(t)
        // .attr("r", function(d) { return d.radius; })
    ;
    // var node = svg.select("g")//.attr("transform", "translate(" + width / 2 + "," + height /2 + ")")
    //     .selectAll("circle")
    node.append("title")
        .text(function(d) { return d.name; });

    //.attr("x", function(d, i) { return i * 32; });

    // bound force
    // var bound_force =  d3.forceSimulation()
    //   .force('charge', d3.forceManyBody()
    //   .strength(1000))
    //   // .size([width, height])
    //   .on('tick', boundtick)
    //   .nodes(data);




    function boundTick(e) {
        node.attr("cx", function (d) { return d.x = pythagx(d.radius, d.y, d.x); })
            .attr("cy", function (d) { return d.y = pythagy(d.radius, d.x, d.y); })
            .attr("r", function(d) { if (d.radius>innerRadius/2){return innerRadius/2.5} else{return d.radius}; });
    }

    function pythagx(r, b, coord) {
        if (d.radius>innerRadius/2){r = innerRadius/2.5};
        var length = Math.sqrt(Math.pow(Math.abs(b-height/2)+r,2)+Math.pow(Math.abs(coord-width/2)+r,2));

        if (length>radius){
            var angle = Math.acos((coord-width/2)/length);
            if (b-height/2<0){
                if (coord-width/2<0){
                    return width/2 - (radius-r-Math.random()*100) * Math.cos(angle+Math.PI) }
                else{return width/2 + (radius-r-Math.random()*100) * Math.cos(angle) }
            }else{
                if (coord-width/2>0){
                    return width/2 + (radius-r-Math.random()*100) * Math.cos(angle) }
                else{return width/2 + (radius-r-Math.random()*100) * Math.cos(angle) }}
        }
        return coord;
    }
    function pythagy(r, b, coord) {
        if (d.radius>innerRadius/2){r = innerRadius/2.5};
        var length = Math.sqrt(Math.pow(Math.abs(b-width/2)+r,2)+Math.pow(Math.abs(coord-height/2)+r,2));

        if (length>radius){

            var angle = Math.acos((b-width/2)/length);
            if (b-width/2<0){
                if (coord-height/2<0){
                    return height/2 - (radius-r-Math.random()*100) * (Math.sin(angle)) }
                else{return height/2 + (radius-r-Math.random()*100) * (Math.sin(angle)) }
            }else{
                if (coord-height/2>0){
                    return height/2 + (radius-r-Math.random()*100) * (Math.sin(angle)) }
                else{return height/2 - (radius-r-Math.random()*100) * (Math.sin(angle)) }
            }
        }
        return coord;
    }


    function layoutTick(e) {
        node
            .attr("cx", function(d) {  return d.x ; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.radius; });
    }

    function showActor(d){

        svg.selectAll('circle').remove();
        //d3.selectAll("#scaleRadialGraph").remove();
        d3.selectAll("#actorPics").remove();
        d3.selectAll("#Timesvg").selectAll("*").remove();
        timeLabelGraph(0,1);
        ScaleRadialGraphUpdate(COLUMN_ARRAY);
        // console.log(d.actor_id*1)
        postActorData(d.actor_id*1);
        //postActorData(d.actor_id);

    }

    var yAxis = svg.select("g")
        .attr("text-anchor", "end");
}


//showActor function in bubble Radial graph







