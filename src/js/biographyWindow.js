function biographyWindow(actor_id) {



    // var actordiv = d3.select("#actorPicdiv"),
    //     actorwidth = +actordiv.attr("width"),
    //     actorheight = +actordiv.attr("height");
    //
    // actordiv.append("svg")
    //     .attr("width",150)
    //     .attr("height", 200)
    //     .append("svg:image")
    //     .attr("xlink:href", function(d) {
    //         return "crawler/"+actor_id+".jpg"
    //     })
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width",200)
    //     .attr("height", 200);

    var div = d3.select("#Biodiv"),
        width = +div.attr("width"),
        height = +div.attr("height");
    //var div = document.getElementById('Biodiv');
    //var node = document.createTextNode("this is a paragraph");

    d3.text("crawler/"+actor_id+".txt", function(text) {

        console.log(width)

        div.append("svg")
            .attr("width",698)
            .attr("height", 200)
            .attr("id","biosvgpic")
            .attr("left",300)
            .append("svg:image")
            .attr("xlink:href", function(d) {
                return "crawler/"+actor_id+".jpg"
            })
            .attr("x", 250)
            .attr("y", 0)
            .attr("width",200)
            .attr("height", 200);
            div.append("text")
                .attr("id","biosvgbio")
            .text(text)

    })
}