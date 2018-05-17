function forceDirectGraph(inputdata){
    
    var svg = d3.select("#Actorsvg"),
        width = +svg.attr("width"),
        height = +svg.attr("height")
    var innerRadius =250;
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
        .range(['#9d0107', '#091592']);
    var graph = inputdata;
    // d3.json(inputdata, function(error, graph) {
    //console.log(graph);
    //if (error) throw error;
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.movies)
        .enter().append("line")
        .attr("stroke-width", 4)
        .attr("stroke-opacity", 0.2)
        .attr("stroke", function(d){return color(d.value);});
    var defs = svg.append("defs");
    defs.selectAll(".patterns")
        .data(graph.actors, function(d) {
            return d})
        .enter().append("pattern")
        .filter(function (d, i) { return i === 0;})
        .attr("id", function(d) {return "actor-" + (d.actor_id)})
        .attr("width", 1)
        .attr("height", 1)
        .append("svg:image")
        .attr("xlink:href", function(d) {
            return "crawler/"+d.actor_id+".jpg"
        }).attr("x", -10)
        .attr("y", -5)
        .attr("width",80)
        .attr("height", 80);
    defs.selectAll(".patterns")
        .data(graph.actors, function(d) {
            return d})
        .enter().append("pattern")
        .filter(function (d, i) { return i != 0;})
        .attr("id", function(d) {return "actor-" + (d.actor_id)})
        .attr("width", 1)
        .attr("height", 1)
        .append("svg:image")
        .attr("xlink:href", function(d) {
            return "crawler/"+d.actor_id+".jpg"
        }).attr("x", -5)
        .attr("y", -2)
        .attr("width",40)
        .attr("height", 40);
    // the first node lying in the center
    //representing the actor whose network is currently showing
    var node0 = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.actors)
        .enter()
        .filter(function (d, i) { return i === 0;}).append("circle")
        .attr("r", 30)
        .attr("stroke-width", 5)
        //.on("click", nextActor)
        .attr("stroke", function(d) { return d3.rgb(genderColor(d.gender)).brighter(0.5); })
        .on("click", bubbleView)
        //.attr("fill", function(d) { return genderColor(d.gender); }) // gender: 2 if male, 2 if female
        .style("fill", function(d) {
            return "url(#actor-"+d.actor_id+")"
        });


    //rest of the nodes; can be dragged
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.actors)
        .enter().append("circle")
        .attr("r", 15)
        .filter(function (d, i) { return i != 0;})
        .style("fill", function(d) {
            return "url(#actor-"+d.actor_id+")"
        })
        .attr("stroke-width", 2)
        .attr("stroke", function(d) { return genderColor(d.gender); })
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
            .attr("x1", width/2)//function(d) { return d.source.x; })
            .attr("y1", height/2)//function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        node0
            .attr("cx", width/2)//function(d) { return d.x; })
            .attr("cy", height/2)//function(d) { return d.y; });
    }

// CREATE THE MOVIE DENSITY MAP VISUALIZATION
//     color = d3.scaleLinear().domain([0,10])
//         .interpolate(d3.interpolateHcl)
//         .range([d3.rgb("#ff000d"), d3.rgb('#00ff03')]);
//
//     var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height /2 + ")") ;
//
//     var node_movies = d3.json('data.json', function(error,data){
//
//
//         var planetGradients = svg.append("defs").selectAll("radialGradient")
//             .data(data)
//             .enter().append("radialGradient")
//             //Create a unique id per "planet"
//             .attr("id", function(d){ return "gradient-" + d.id; })
//             .attr("cx", "50%") //Move the x-center location towards the left
//             .attr("cy", "50%") //Move the y-center location towards the top
//             .attr("r", "50%"); //Increase the size of the "spread" of the gradient
//
//         planetGradients.append("stop")
//             .attr("offset", "0%")
//             .attr("stop-color", function(d) {
//                 return d3.rgb(color(d.vote_average));
//             });
//
// //Then the actual color almost halfway
//         planetGradients.append("stop")
//             .attr("offset", "50%")
//
//             .attr("stop-color", function(d) {
//                 return d3.rgb(color(d.vote_average)).brighter(1);
//             })
//             .attr("stop-opacity",0);
//
// //Finally a darker color at the outside
//         planetGradients.append("stop")
//             .attr("offset",  "100%")
//             .style("opacity", 0)
//             .attr("stop-color", function(d) {
//                 //return color(d.vote_average)
//                 return d3.rgb(color(d.vote_average)).brighter(2);
//             })
//             .attr("stop-opacity",0);
//
//         var movie_nodes = g.selectAll(".planetGradient")
//             .data(data)
//             .enter().append("circle")
//         //.attr("class", "planetsGradient")
//             .attr("cx", function(d, i) { return 0.8*innerRadius*Math.sin( 2 * Math.PI*d.relative_position); })
//             .attr("cy", function(d, i) { return 0.8*innerRadius*(-Math.cos( 2 * Math.PI*d.relative_position)); })
//             //.attr("r", function(d) { return planetScale(d.diameter)/2; })
//             .attr("r", function(d) { return Math.log(d.score+1)*10;})
//             .style("fill", function(d) { return "url(#gradient-" + d.id + ")"; })
//             ;
//         movie_nodes.append("title").text(function(d){return d.title})
//     });


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
    function bubbleView(d){
        svg.selectAll("*").remove();
        scaleRadialGraph();
        bubbleRadialGraph();
    }

}