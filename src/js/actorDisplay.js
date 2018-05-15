

//this function is to display the image according to actorID
function actorDisplay(actorID = 2){
  //Get the file path of the image corresponded to the actorID
  var filePath = "../../crawler/".concat((actorID.toString()).concat(".jpg"));
  var img = document.getElementById("actorImg");
  var actorDescription = document.getElementById('actorDescription');
  var description = '123';
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
    console.log(123);
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
  console.log(123);
  //this is to get the actor description some there are some errors here

  //the codes below are supposed to work but not 
  // var fs = require('fs');
  // var data = fs.readFileSync(("../../crawler/".concat((actorID.toString()).concat(".txt"))),'utf8');
  // description = data;
  // console.log(data);
  // actorDescription.innerText = description;

}

//this is for csv query. not finished image part finish
//reference:https://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript/12289296#12289296
