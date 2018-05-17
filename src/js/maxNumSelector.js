d3.select("#nValue").on("input", function() {
    MAX_NUM=+this.value;

    update(MAX_NUM);
});


function update(nValue) {
    d3.select("#Actorsvg").selectAll("*").remove();
    d3.selectAll("#biosvgpic").remove();
    d3.selectAll("#biosvgbio").remove();
    updateGraph(START_T,END_T,nValue,GENRES);
}
