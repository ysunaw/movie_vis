function starPrintFunction() {
    var svg = d3.select("#Mainsvg"),
        //svg = Mainsvg.append(svg)
        width = +svg.attr("width"),
        height = +svg.attr("height");


    var numStars = 400;
    var starsSize = d3.range(numStars).map(function(d){return Math.random()*Math.random()*20});
    //console.log(d3.range(numStars))
    var stars = svg.append("g").selectAll("g").data(starsSize).enter().append("svg:image").attr("xlink:href", "Four_points_star.png").attr("x", function (d) {
        return Math.random() * width
    })
        .attr("y", function (d) {
            return Math.random() * height
        })
        .attr("width",  function (d) {
            return Math.random() * d
        })
        .attr("height",  function (d) {
            return Math.random() * d
        })
        //.attr("preserveAspectRatio","none")


};


