var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

var width = 10;
var height = 20;
var pixels = 24;
var state = true;

canvas.width = width*pixels
canvas.height = height*pixels

// Draw grey board
function drawboard(){
  ctx.strokeStyle = "#555"
  for(let y = 0;y<height;y++){
    for(let x = 0; x<height;x++){
      ctx.strokeRect(x*pixels,y*pixels,pixels,pixels)
    }
  }
}
drawboard()


