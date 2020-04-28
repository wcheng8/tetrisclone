const canvas = document.getElementById("board");
const context = canvas.getContext("2d");
let play = true
context.scale(20, 20);

function clearcanvas() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

function draw() {
  clearcanvas();
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
function playerDrop() {
  player.pos.y++;
  dropCounter = 0;
}
// Add droping factor to the peice
let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  lasttime = time;
  draw();
  if (play){
    requestAnimationFrame(update);
  }
}

const player = {
  pos: { x: 5, y: 5 },
  matrix: matrix,
};

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 37) {
    player.pos.x--;
  } else if (event.keyCode == 39) {
    player.pos.x++;
  } else if (event.keyCode == 40) {
    playerDrop();
  }
});

update();
