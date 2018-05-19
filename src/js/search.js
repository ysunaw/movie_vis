function toggle_visibility(id) {
    var e = document.getElementById(id);// get the text div
    console.log(document.getElementById('seeker').value)
    if (document.getElementById('seeker').value == ""){e.style.display = 'none';}else{e.style.display = 'block';}
    // if(e.style.display == 'block') e.style.display = 'none';
    // else e.style.display = 'block';
}





// function myFunction() {
//     // Declare variables
//     var input, filter, ul, li, a, i;
//     input = document.getElementById('myInput');
//     filter = input.value.toUpperCase();
//     ul = document.getElementById("myUL");
//     li = ul.getElementsByTagName('li');
//
//     // Loop through all list items, and hide those who don't match the search query
//     for (i = 0; i < li.length; i++) {
//         a = li[i].getElementsByTagName("a")[0];
//         if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         } else {
//             li[i].style.display = "none";
//         }
//     }
// }