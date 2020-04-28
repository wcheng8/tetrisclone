const canvas = document.getElementById("board");
const context = canvas.getContext("2d");
let play = true;
context.scale(20, 20);

function clearcanvas() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Create current board matrix
function createMatrix(w, h) {
  const matrix = [];
  for (let y = 0; y < h; y++) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

// Tetrimono
const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

// Detect if collision exists
function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// Draw tetrimino function
function draw() {
  clearcanvas();
  drawMatrix(arena, {x:0, y:0})
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

// Drop tetrimino
function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0;
  }
  dropCounter = 0;
}

function playerMove(dir){
  player.pos.x+= dir
  if (collide(arena,player)){
    player.pos.x -=dir
  }
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
  if (play) {
    requestAnimationFrame(update);
  }
}

// Current player position
const player = {
  pos: { x: 5, y: 5 },
  matrix: matrix,
};

// Update tetrimino to the arena board
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// Board Matrix
const arena = createMatrix(12, 20);
console.table(arena);

// Arrow key handling
document.addEventListener("keydown", (event) => {
  if (event.keyCode == 37) {
    playerMove(-1)
  } else if (event.keyCode == 39) {
    playerMove(1)
  } else if (event.keyCode == 40) {
    playerDrop();
  }
});

update();
