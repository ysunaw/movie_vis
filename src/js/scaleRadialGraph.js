	var inputdata = [2259827.5,4392447.222222222,2500600.0,2950530.090909091,40098704.6,67435522.875,17352395.444444444,37953409.25,5941666.666666667,15050906.5,3042281.1818181816,27937435.90909091,41744789.88235294,14833138.57142857,12008973.0,16895999.42857143,15284872.083333334,25407139.46153846,18424354.214285713,37386477.11111111,23849786.772727273,31120216.864864863,21767278.18604651,35443322.258064516,46461008.5,45741256.461538464,57104227.488372095,43478834.06349207,41793550.38297872,41145145.906542055,36099637.13888889,29616286.13375796,31870650.792746115,39761869.36057692,54277852.941176474,47324504.133004926,57425954.62962963,62292045.959349595,72820491.08745247,70305362.14590748,77504203.04067796,84408921.95548962,82026111.11325967,66330294.702083334,74347212.96458334,83448020.45,79945958.02597402,84135915.81508079,88221932.75855856,120544648.53939395];
	scaleRadialGraph(inputdata);
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
				// 		for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
				// d.total = t;
			//d.total = d[columns[1]] = +d[columns[1]];
			 
			return d;
		

		}, 
// var inputdata = [2259827.5,4392447.222222222,2500600.0,2950530.090909091,40098704.6,67435522.875,17352395.444444444,37953409.25,5941666.666666667,15050906.5,3042281.1818181816,27937435.90909091,41744789.88235294,14833138.57142857,12008973.0,16895999.42857143,15284872.083333334,25407139.46153846,18424354.214285713,37386477.11111111,23849786.772727273,31120216.864864863,21767278.18604651,35443322.258064516,46461008.5,45741256.461538464,57104227.488372095,43478834.06349207,41793550.38297872,41145145.906542055,36099637.13888889,29616286.13375796,31870650.792746115,39761869.36057692,54277852.941176474,47324504.133004926,57425954.62962963,62292045.959349595,72820491.08745247,70305362.14590748,77504203.04067796,84408921.95548962,82026111.11325967,66330294.702083334,74347212.96458334,83448020.45,79945958.02597402,84135915.81508079,88221932.75855856,120544648.53939395];

// 		inputdata.map(function(num){
// 		var d={total : num};console.log(d.key);
// 		return d;
// 		}),

		 function(error, data) {

		 	if (error) throw error;
		 	// console.log(data.columns.slice(1));
		 	data.sort(function(a, b) { return a[data.columns[0]] -  b[data.columns[0]]; });
		 	//console.log( b[data.columns[6]] -  a[data.columns[6]]);
		 	x.domain(data.map(function(d) {return d[""]; }));
		 	y.domain([0, d3.max(data, function(d) { return d.total; })]);
		 	z.domain(data.columns.slice(1));

		 	g.append("g")
		 		.selectAll("g")
   				.data(d3.stack().keys(data.columns.slice(1))(data)) // data key; the category it belongs to 
     			.enter().append("g")
     			.attr("fill", function(d) {return z(d); })
    				.selectAll("path")
     			.data(function(d) { return d; })
     			.enter().append("path")

    				.attr("d", d3.arc()

     			.innerRadius(function(d) {return y(d[0]); })
     			.outerRadius(function(d) { return y(d[1]); })
     			.startAngle(function(d) { return x(d.data[""]); })
    			.endAngle(function(d) { return x(d.data[""]) + x.bandwidth(); })
     			.padAngle(0.01)
     			.padRadius(innerRadius));


    // var label = g.append("g")
    // .selectAll("g")
    // .data(data)
    // .enter().append("g")
    //   .attr("text-anchor", "middle")// the transformed function here
    //   .attr("transform", function(d) { return "rotate(" + ((x(d[""]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

    // label.append("text")
    //   .attr("transform", function(d) { return (x(d[""]) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })// appending the State label here
    //   .text(function(d) { return d[""]; })
    //   .filter();


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
                    // .attr("x2", "0%")
                    // .attr("y2", "100%")
                     // .attr("x1", function(d){console.log(d[""],Math.abs(100*Math.cos(d[""]/50*Math.PI))+"%");
                     // var check = d[""]/50;
                     // if (check<0.25)
                     // 	return "100%"
                     //return Math.abs(100*Math.cos(d[""]/50*Math.PI))+"%"})
                    // .attr("y1", function(d){return Math.abs(100*Math.cos(d[""]/50*Math.PI))+"%"})
                    // .attr("x2", function(d){return Math.abs(100*Math.cos(d[""]/50*2*Math.PI))+"%"})
                    // .attr("y2", function(d){return Math.abs(100*Math.cos(d[""]/50*2*Math.PI))+"%"})

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





