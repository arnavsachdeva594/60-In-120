const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 18;
const GRID_COLOR = '#333';
const DEAD_COLOR = '#222';
const ALIVE_COLOR = '#00e676';

let rows = 40;
let cols = 60;
canvas.width = cols * CELL_SIZE;
canvas.height = rows * CELL_SIZE;

let grid = createGrid(rows, cols);
let running = false;
let interval = null;
let speed = 5;

function createGrid(r, c) {
  return Array.from({ length: r }, () => Array(c).fill(0));
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = grid[y][x] ? ALIVE_COLOR : DEAD_COLOR;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE, 0);
    ctx.lineTo(x * CELL_SIZE, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL_SIZE);
    ctx.lineTo(canvas.width, y * CELL_SIZE);
    ctx.stroke();
  }
}

function nextGeneration() {
  const next = createGrid(rows, cols);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          let ny = y + i, nx = x + j;
          if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
            neighbors += grid[ny][nx];
          }
        }
      }
      if (grid[y][x]) {
        next[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
      } else {
        next[y][x] = (neighbors === 3) ? 1 : 0;
      }
    }
  }
  grid = next;
  drawGrid();
}

function start() {
  if (!running) {
    running = true;
    interval = setInterval(nextGeneration, 1000 / speed);
  }
}

function pause() {
  running = false;
  clearInterval(interval);
}

function step() {
  pause();
  nextGeneration();
}

function reset() {
  pause();
  grid = createGrid(rows, cols);
  drawGrid();
}

function randomize() {
  pause();
  grid = grid.map(row => row.map(() => Math.random() > 0.7 ? 1 : 0));
  drawGrid();
}

document.getElementById('start').onclick = start;
document.getElementById('pause').onclick = pause;
document.getElementById('step').onclick = step;
document.getElementById('reset').onclick = reset;
document.getElementById('random').onclick = randomize;

const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');

speedSlider.oninput = (e) => {
  speed = +e.target.value;
  speedValue.textContent = speed;
  if (running) {
    pause();
    start();
  }
};
speedValue.textContent = speed;

canvas.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[y][x] = grid[y][x] ? 0 : 1;
    drawGrid();
  }
});

drawGrid();
