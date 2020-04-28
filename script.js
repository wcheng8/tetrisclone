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
//  Create matrix peice
function createPeice(type) {
  if (type == "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type == "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type == "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type == "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type == "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type == "Z") {
    return [
      [6, 6, 0],
      [0, 6, 6],
      [0, 0, 0],
    ];
  } else if (type == "S") {
    return [
      [0, 7, 7],
      [7, 7, 0],
      [0, 0, 0],
    ];
  }
}

function arenaSweep(){
  let rowCount = 1
  outer: for (let y = arena.length -1; y>0; y--){
    for (let x = 0;x<arena[y].length;x++){
      if (arena[y][x] == 0){
        continue outer;
      }
    }
    const row = arena.splice(y,1)[0].fill(0)
    arena.unshift(row)
    y++
    player.score += rowCount*10
    rowcount *=2
  }
}

function playerReset() {
  const peices = "ILJOTSZ";
  player.matrix = createPeice(
    peices[Math.floor(peices.length * Math.random())]
  );
  player.pos.x = 5;
  player.pos.y = 0;
  if (collide(arena, player)) {
    alert("game over");
    player.score = 0
    updateScore()
    arena.forEach((row) => row.fill(0));
  }
}

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
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  const colors = [
    null,
    "red",
    "blue",
    "yellow",
    "green",
    "orange",
    "purple",
    "aqua",
  ];  
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
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
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

// Player rotate
function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix);
  // check collision in while
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player, -dir);
      player.pos.x = pos;
      return;
    }
  }
}
// Rotate function
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
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

// Initial player position
const player = {
  pos: { x: 5, y: 5 },
  matrix: null,
  score: 0
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
    playerMove(-1);
  } else if (event.keyCode == 39) {
    playerMove(1);
  } else if (event.keyCode == 40) {
    playerDrop();
  } else if (event.keyCode == 38) {
    playerRotate(1);
  }
});

// Update score
function updateScore(){
  document.getElementById('score').innerHTML = player.score
}

playerReset()
updateScore()
update();
