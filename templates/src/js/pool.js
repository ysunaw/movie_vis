function drawPool() {
    var svg = d3.select("#Poolsvg"),
        //svg = Mainsvg.append(svg)
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        innerRadius = 250;


    var poolGradients = svg.append("defs").append("radialGradient")
        .attr("id", "gradientpool")
        .attr("cx", "50%") //Move the x-center location towards the left
        .attr("cy", "50%") //Move the y-center location towards the top
        .attr("r", "50%"); //Increase the size of the "spread" of the gradient
    poolGradients.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", function (d) {
            return d3.rgb("#281437");
        });
//Then the actual color almost halfway
    poolGradients.append("stop")
        .attr("offset", "50%")

        .attr("stop-color", function (d) {
            return d3.rgb("#281437").brighter(1);
        });

//Finally a darker color at the outside
    poolGradients.append("stop")
        .attr("offset", "100%")
        .style("opacity", 0)
        .attr("stop-color", function (d) {
            //return color(d.vote_average)
            return d3.rgb("#281437").darker(1);
        });


    var pool = svg.append('circle')
        .style('stroke-width', 0)
        .attr("fill", function () {
            return "url(#gradientpool)"
        })//"#281437")
        .attr("r", innerRadius)
        .attr("cy", 0.5 * height)
        .attr("cx", 0.5 * width);
    radius = innerRadius;

    var star = svg.append('svg:image')
        .attr('x', -50)
        .attr('y', -50)
        .attr('width', 100)
        .attr('height', 100)
        .attr("xlink:href", "star.png")
        .attr("transform", "translate(" + width / 2 + "," + height /2 + ")");

};