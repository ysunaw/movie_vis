

//this function is to display the image according to actorID
function actorDisplay(actorID){
  //Get the file path of the image corresponded to the actorID
  var filePath = "../../crawler/".concat((actorID.toString()).concat(".jpg"));
  var img = document.getElementById("actorImg");

  img.src = filePath;
  // Get the modal
  var modal = document.getElementById('actorDisplayModal');
  // Get the button that opens the modal
  var btn = document.getElementById("actorDisplayBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal
  btn.onclick = function() {
      modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

//this is for csv query. not finished
//reference:https://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript/12289296#12289296

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data.txt",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
}
