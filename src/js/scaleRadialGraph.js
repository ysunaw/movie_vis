

function scaleRadialGraph(inputdata) {
    console.log(START_T,END_T,inputdata);
    var svg = d3.select("#Chartsvg"),
        //svg = Mainsvg.append(svg)
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        innerRadius = 250,
        outerRadius = innerRadius + 125//Math.min(width, height) * 0.6,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0);

    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius]);

    var z = d3.scaleOrdinal()
        .range(["#72818B", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var data = inputdata
    //console.log(d3.range(data.length));

    //data.sort(function(a, b) { return a[data.columns[0]] -  b[data.columns[0]]; });

    x.domain(d3.range(data.length));

            //data.sort(function(a, b) { return a[data.columns[0]] -  b[data.columns[0]]; });

            var max = Math.max.apply(null, data);

            var color = d3.scaleLinear().domain([0,max])
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb("#281437"), d3.rgb('#b783ff')]);
            //console.log(array);
            y.domain([0, max]);

            var gradient = svg.append("defs")
                .selectAll("linearGradient")
                .data(data)
                .enter().append("linearGradient")
                .attr("id", function(d){return "gradient2-" + data.indexOf(d); })
                .attr("x1", "100%")
                .attr("y1", "100%")
                .attr("spreadMethod", "pad");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", function(d){return color(0)})
                .attr("stop-opacity", 1);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", function(d){return color(d)})
                .attr("stop-opacity", 1);

            var pie = d3.pie()
                .sort(null);
            var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            var grads = svg.append("defs").selectAll("radialGradient").data(pie(data))
                .enter().append("radialGradient")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", "40%")
                .attr("id", function(d, i) { return "grad" + i; });
            grads.append("stop").attr("offset", "65%").style("stop-color", function(d, i) {return d3.rgb("#281437").darker(1); });
            //grads.append("stop").attr("offset", "80%").style("stop-color", "white");
            grads.append("stop").attr("offset", "100%").style("stop-color", function(d, i) { return color(d.value); })
                .attr("stop-opacity",0.8);

            // var path = g.append("g").selectAll("path")
            //     .data(pie(data.map(function(d) { return d; }))
            //     .enter().append("path")
            //     .attr("fill", function(d, i) { return "url(#gradient2-" + i + ")"; })
            //     .attr("d", arc);
            var chart = g.append("g")
                .selectAll("path")
                .data(pie(data.map(function(d) { return d; })))
                .enter().append("path")
                .attr("id","scaleRadialGraph")
                .attr("fill", function(d) {return "url(#grad" + d.index + ")"; })


                .attr("d", d3.arc()

                    .innerRadius(function(d) { return y(0); })
                    .outerRadius(function(d) { return y(d.data); })
                    .startAngle(function(d) { return x(d.index); })
                    .endAngle(function(d) { return x(d.index) + x.bandwidth(); })
                    .padAngle(0.01)
                    .padRadius(innerRadius));

        };





