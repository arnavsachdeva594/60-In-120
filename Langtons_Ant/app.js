const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let antX, antY, antDirection, isRunning, speed, gridSize;
let grid = [];
let interval;

const startPauseBtn = document.getElementById("startPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const speedSlider = document.getElementById("speed");
const speedLabel = document.getElementById("speedLabel");
const sizeInput = document.getElementById("size");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

const initializeGrid = (size) => {
    grid = Array(size).fill().map(() => Array(size).fill(0));
    canvas.width = size * 10;
    canvas.height = size * 10;
    antX = Math.floor(size / 2);
    antY = Math.floor(size / 2);
    antDirection = 0; // 0 - up, 1 - right, 2 - down, 3 - left
};

const drawGrid = () => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            ctx.fillStyle = grid[i][j] === 0 ? "#444" : "#fff";
            ctx.fillRect(j * 10, i * 10, 10, 10);
        }
    }
};

const moveAnt = () => {
    if (grid[antY][antX] === 0) {
        grid[antY][antX] = 1;
        antDirection = (antDirection + 1) % 4; // Turn 90 degrees clockwise
    } else {
        grid[antY][antX] = 0;
        antDirection = (antDirection + 3) % 4; // Turn 90 degrees counter-clockwise
    }

    if (antDirection === 0) antY--; // Up
    else if (antDirection === 1) antX++; // Right
    else if (antDirection === 2) antY++; // Down
    else antX--; // Left

    if (antX < 0) antX = grid.length - 1;
    if (antX >= grid.length) antX = 0;
    if (antY < 0) antY = grid.length - 1;
    if (antY >= grid.length) antY = 0;
};

const update = () => {
    moveAnt();
    drawGrid();
};

const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
};

startPauseBtn.addEventListener("click", () => {
    if (isRunning) {
        clearInterval(interval);
        startPauseBtn.textContent = "Start";
    } else {
        interval = setInterval(update, speed);
        startPauseBtn.textContent = "Pause";
    }
    isRunning = !isRunning;
});

resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    initializeGrid(gridSize);
    drawGrid();
    startPauseBtn.textContent = "Start";
    isRunning = false;
});

speedSlider.addEventListener("input", (e) => {
    speed = 200 - e.target.value;
    speedLabel.textContent = e.target.value;
    if (isRunning) {
        clearInterval(interval);
        interval = setInterval(update, speed);
    }
});

sizeInput.addEventListener("input", (e) => {
    gridSize = e.target.value;
    initializeGrid(gridSize);
    drawGrid();
});

toggleDarkModeBtn.addEventListener("click", toggleDarkMode);

// Initialize the grid with default size
gridSize = sizeInput.value;
initializeGrid(gridSize);
drawGrid();
