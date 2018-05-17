function biographyWindow() {
    actor_id = 2232

    // var svg = d3.select("#Biodiv"),
    //     width = +svg.attr("width"),
    //     height = +svg.attr("height");
    var div = document.getElementById('Biodiv');
    //var node = document.createTextNode("this is a paragraph");
    d3.text("crawler/"+actor_id+".txt", function(text) {
        console.log(text.length);
        var node = document.createTextNode(text);
        div.appendChild(node);
        // svg.append("text")
        //     //.attr("width",width)
        //     //.attr("height",height)
        //     //.attr("id","ResizeTXT")
        //     //.attr("x",0)
        //     //.attr("y",100)
        //     .attr("stroke", "white")
        //     .text(text)


        // Wrap text in a rectangle, and size the text to fit.


    })
}