function biographyWindow() {
    actor_id = 2232

    var svg = d3.select("#Biodiv"),
        width = +svg.attr("width"),
        height = +svg.attr("height");


    d3.text("crawler/"+actor_id+".txt", function(text) {
        console.log(text.length)


        svg.append("text")
            .attr("x",0)
            .attr("y",100)
            .style("stroke", "white")
            .text(text)
            // .append("div")
            // .attr("width",1000)
            // .attr("height",1000)
            //.append("svg")

            // .style("stroke", "white")
            // .attr("width",500)
            // .attr("height",400)
            // //.attr("id","ResizeTXT")



        // Wrap text in a rectangle, and size the text to fit.


    })
}