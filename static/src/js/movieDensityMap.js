function movieDensityMap(inputdata) {
    var svg = d3.select("#Actorsvg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        innerRadius = 250;

    color = d3.scaleLinear().domain([0, 10])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#ff000d"), d3.rgb('#00ff03')]);

    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // var node_movies = d3.json('data.json', function (error, data) {

    var data = inputdata;

    var planetGradients = svg.append("defs").selectAll("radialGradient")
        .data(data)
        .enter().append("radialGradient")
        //Create a unique id per "planet"
        .attr("id", function (d) {
            return "gradient-" + d.id;
        })
        .attr("cx", "50%") //Move the x-center location towards the left
        .attr("cy", "50%") //Move the y-center location towards the top
        .attr("r", "50%"); //Increase the size of the "spread" of the gradient

    planetGradients.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", function (d) {
            return d3.rgb(color(d.vote_average));
        });

//Then the actual color almost halfway
    planetGradients.append("stop")
        .attr("offset", "50%")

        .attr("stop-color", function (d) {
            return d3.rgb(color(d.vote_average)).brighter(1);
        })
        .attr("stop-opacity", 0);

//Finally a darker color at the outside
    planetGradients.append("stop")
        .attr("offset", "100%")
        .style("opacity", 0)
        .attr("stop-color", function (d) {
            //return color(d.vote_average)
            return d3.rgb(color(d.vote_average)).brighter(2);
        })
        .attr("stop-opacity", 0);

    var movie_nodes = g.selectAll(".planetGradient")
        .data(data)
        .enter().append("circle")
        //.attr("class", "planetsGradient")
        .attr("cx", function (d, i) {
            return 0.8 * innerRadius * Math.sin(2 * Math.PI * d.relative_position);
        })
        .attr("cy", function (d, i) {
            return 0.8 * innerRadius * (-Math.cos(2 * Math.PI * d.relative_position));
        })
        //.attr("r", function(d) { return planetScale(d.diameter)/2; })
        .attr("r", function (d) {
            return Math.log(d.score + 1) * 10;
        })
        .style("fill", function (d) {
            return "url(#gradient-" + d.id + ")";
        })
    ;
    movie_nodes.append("title").text(function (d) {
        return d.title
    })
};
    // };
