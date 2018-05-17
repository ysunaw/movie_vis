	function scaleRadialGraph(inputdata){
		var svg = d3.select("#Chartsvg"),
			//svg = Mainsvg.append(svg)
		width = +svg.attr("width"),
		height = +svg.attr("height"),
		innerRadius = 250,
		outerRadius = innerRadius+125//Math.min(width, height) * 0.6,
		g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height /2 + ")");

		var x = d3.scaleBand()
		.range([0, 2 * Math.PI])
		.align(0);

		var y = d3.scaleRadial()
		.range([innerRadius, outerRadius]);

		var z = d3.scaleOrdinal()
		.range(["#72818B", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		//CONVERT INPUT DATA TO CSV

		d3.csv("data_columns.csv", function(d, i, columns) {
			// console.log(d.relative_position);

			for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
			 	d.total = t;
			 return d;
			return d;
		

		}, 
		 function(error, data) {

		 	if (error) throw error;
		 	
      var yAxis = g.append("g")
      .attr("text-anchor", "end");
  });
        d3.csv("data_columns.csv", function(d, i, columns) {

                for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
                d.total = t;
                return d;

                return d;


            },

            function(error, data) {

                if (error) throw error;
                data.sort(function(a, b) { return a[data.columns[0]] -  b[data.columns[0]]; });
                x.domain(data.map(function(d) {return d[""]; }));
                y.domain([0, d3.max(data, function(d) { return d.total; })]);
                var array = data.map(function(d){return d.total})	;
                var max = Math.max.apply(null, array);
                var color = d3.scaleLinear().domain([0,max])
                    .interpolate(d3.interpolateHcl)
                    .range([d3.rgb("#281437"), d3.rgb('#b783ff')]);
                z.domain(data.columns.slice(1));
				//console.log(array);

                var gradient = svg.append("defs")
                    .selectAll("linearGradient")
                    .data(data)
                    .enter().append("linearGradient")
                    .attr("id", function(d){ return "gradient2-" + d[""]; })
                    .attr("x1", "100%")
                    .attr("y1", "100%")
                    .attr("spreadMethod", "pad");

                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", function(d){return color(0)})
                    .attr("stop-opacity", 1);

                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", function(d){return color(d.revenue)})
                    .attr("stop-opacity", 1);

                var pie = d3.pie()
                    .sort(null);
                var arc = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
                var grads = svg.append("defs").selectAll("radialGradient").data(pie(data.map(function(d) { return d.revenue; })))
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
                    .data(pie(data.map(function(d) { return d.revenue; })))
                    .enter().append("path")
                    .attr("fill", function(d) {return "url(#grad" + d.index + ")"; })


                    .attr("d", d3.arc()

                        .innerRadius(function(d) { return y(0); })
                        .outerRadius(function(d) { return y(d.data); })
                        .startAngle(function(d) { return x(d.index); })
                        .endAngle(function(d) { return x(d.index) + x.bandwidth(); })
                        .padAngle(0.01)
                        .padRadius(innerRadius));

            });


}





