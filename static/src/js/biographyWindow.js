function biographyWindow(actor_id) {


    var div = d3.select("#Biodiv"),

        width = +div.attr("width"),
        height = +div.attr("height");

    d3.text("crawler/"+actor_id+".txt", function(text) {



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