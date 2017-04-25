// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process
$=require("jquery")
$( document ).ready(function() {
  console.log( "ready!" );
  $( "form" ).submit(function( event ) {
    console.log("submitted");
    inputFile=document.getElementById("inputFile").files[0].name;
    fromPage=document.getElementById("fromPage").value
    toPage=document.getElementById("toPage").value
    console.log(inputFile)
    console.log(fromPage)
      console.log(toPage)
      arr=[inputFile,fromPage,toPage]
      console.log(arr)
    //alert( "Handler for .submit() called." );
    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('buttonClicked',arr);
    event.preventDefault();



    });
});