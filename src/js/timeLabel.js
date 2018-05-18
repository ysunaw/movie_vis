
function timeLabelGraph(start_t, end_t) {

    function returnRange(start_t, end_t){
        var start_time = 1930+Math.round(87*start_t),
            end_time = 1930+Math.round(87*end_t),
            mainArray = new Array,
            binSize = Math.round((end_time-start_time)/5),
            smallArray = [start_time]
        if (start_time == end_time){return }
        for (var i = start_time+1; i <= end_time; i++){
            if (( ((i-1930)%binSize) == 0 && (i+binSize<end_time)) || i==end_time ){
                console.log(i+binSize);
                smallArray.push(i)
                mainArray.push(""+smallArray[0]+"-"+smallArray[1]+"")
                if((i+1)<=end_time){
                    smallArray = [i+1]
                }
            }

        }
        return mainArray
    }



    var svg = d3.select("#Timesvg"),
        //svg = Mainsvg.append(svg)
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        innerRadius = 250,
        //outerRadius = innerRadius + 125//Math.min(width, height) * 0.6,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var timeArray = returnRange(start_t,end_t)

    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0);
    // var y = d3.scaleRadial()
    //     .range([innerRadius, outerRadius]);


    x.domain(timeArray);


    var label = g.append("g").selectAll("g")
        .data(timeArray)
        .enter().append("g")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {  return "rotate(" + ((x(d) + x.bandwidth() / 2) * 180 / Math.PI- 90) + ")translate(" + innerRadius + ",0)"; });

    label.append("line")
        .attr("x2", -5)
        .attr("stroke", "#000");

    label.append("text")
        .attr("stroke","#b783ff")
        .attr("transform", function(d) { return (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
        //.attr("transform", function(d) { return "rotate(90)translate(0,16)"; })
        .text(function(d) { return d; });

        }