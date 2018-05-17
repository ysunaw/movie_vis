function streamGraph() {

    var tsvData = null;

    var margin = {top: 20, right: 80, bottom: 30, left: 30},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var parseDate = d3.timeParse('%Y');

    var formatSi = d3.format(".3s");

    var formatNumber = d3.format(".1f"),
        formatBillion = function (x) {
            return formatNumber(x / 1e9);
        };

    var x = d3.scaleTime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickFormat(d3.formatPrefix(".1", 1e3));


    var area = d3.area()
        .x(function (d) {
            return x(d.data.date);
        })
        .y0(function (d) {
            return y(d[0]);
        })
        .y1(function (d) {
            return y(d[1]);
        });



    //var selected
    var stack = d3.stack()

    var svg = d3.select('body').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style("position", "absolute")
        .style("top", "100px")
        .style("left", "1000px")
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.csv('data3.csv', function (error, data) {
        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== 'date';
        }));
        var keys = data.columns.filter(function (key) {
            return key !== 'date';
        })
        data.forEach(function (d) {
            d.date = parseDate(d.date);
        });
        tsvData = (function () {
            return data;
        })();


        var maxDateVal = d3.max(data, function (d) {
            var vals = d3.keys(d).map(function (key) {
                return key !== 'date' ? d[key] : 0
            });
            return d3.sum(vals);
        });

        // Set domains for axes
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y.domain([-maxDateVal * 2 / 3, maxDateVal * 2 / 3])

        stack.keys(keys);

        stack.order(d3.stackOrderNone);
        stack.offset(d3.stackOffsetSilhouette);
        console.log(keys.map(function(d,i){return {d:false}}));
        //console.log(stack(data));

        var browser = svg.selectAll('.browser')
            .data(stack(data))
            .enter().append('g')
            .attr('class', function (d) {console.log(d.key);
                return 'browser ' + d.key;
            })
            .attr('fill-opacity', 0.75);

        browser.append('path')
            .attr('class', 'area')
            .attr('d', area)
            .style('fill', function (d) {
                return color(d.key);
            })
            .on("click", function (d) {
                console.log(d.key)
            })
            .on('mouseover', function (d) {
                d3.select(this)
                    .style('fill', function (d) {
                        return d3.rgb(color(d.key)).brighter(1)
                    });

            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .style('fill', function (d) {
                        console.log(color(d.key));
                        return color(d.key);
                    })
            });


        browser.append('text')
            .datum(function (d) {
                return d;
            })
            .attr('transform', function (d) {
                return 'translate(' + x(data[86].date) + ',' + y((d[86][1] + d[86][0]) / 2) + ')';
            })
            .attr('x', 0)
            .attr('dy', '.35em')
            .style("text-anchor", "start")
            .text(function (d) {
                return d.key;
            })
            .attr("stroke", function (d) {
                return d3.rgb(color(d.key)).brighter(1);
            })


            .attr("stroke-width", 0.5)
            .attr('fill-opacity', 1);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .attr("stroke", "white")
            .call(xAxis);


        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        svg.append("text")
            .attr("x", 0 - margin.left)
            .attr("stroke", "white")
            .text("Genres Trends in the Movie Industry")


    });
}