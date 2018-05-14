		var svg = d3.select("svg"),
		width = +svg.attr("width"),
		height = +svg.attr("height"),
		innerRadius = 250,
		outerRadius = Math.min(width, height) * 0.6,
		g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height /2 + ")");

		var x = d3.scaleBand()
		.range([0, 2 * Math.PI])
		.align(0);

		var y = d3.scaleRadial()
		.range([innerRadius, outerRadius]);

		var z = d3.scaleOrdinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		d3.csv("data.csv", function(d, i, columns) {
			for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
				d.total = t;
			return d;
		}, function(error, data) {
			if (error) throw error;
			data.sort(function(a, b) { return b[data.columns[6]] -  a[data.columns[6]]; });
			x.domain(data.map(function(d) { return d.State; }));
			y.domain([0, d3.max(data, function(d) { return d.total; })]);
			z.domain(data.columns.slice(1));

			g.append("g")
			.selectAll("g")
    .data(d3.stack().keys(data.columns.slice(1))(data)) // data key; the category it belongs to 
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .selectAll("path")
    .data(function(d) { return d; })
    .enter().append("path")
    .attr("d", d3.arc()
    	.innerRadius(function(d) { return y(d[0]); })
    	.outerRadius(function(d) { return y(d[1]); })
    	.startAngle(function(d) { return x(d.data.State); })
    	.endAngle(function(d) { return x(d.data.State) + x.bandwidth(); })
    	.padAngle(0.01)
    	.padRadius(innerRadius));

    var label = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")// the transformed function here
      .attr("transform", function(d) { return "rotate(" + ((x(d.State) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

      label.append("text")
      .attr("transform", function(d) { return (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })// appending the State label here
      .text(function(d) { return d.State; });

      var yAxis = g.append("g")
      .attr("text-anchor", "end");
  });

