// Get DOM Elements
const generateBtn = document.getElementById('generateBtn');
const solveBtn = document.getElementById('solveBtn');
const levelDisplay = document.getElementById('levelDisplay');
const solverSteps = document.getElementById('solverSteps');

let currentLevel = null;
let solutionSteps = [];
let currentStep = 0;

// Generate a new level when the button is clicked
generateBtn.addEventListener('click', () => {
    currentLevel = generateLevel();
    solutionSteps = [];
    currentStep = 0;
    updateLevelDisplay(currentLevel);
    solveBtn.disabled = false;
    solverSteps.innerHTML = '';
});

// Display the level in the DOM with smooth transitions
function updateLevelDisplay(level) {
    levelDisplay.innerHTML = '';
    level.map.forEach((row, y) => {
        row.split('').forEach((cell, x) => {
            const div = document.createElement('div');
            div.classList.add('empty');
            if (cell === '#') div.classList.add('wall');
            if (cell === '@') div.classList.add('player');
            if (cell === '$') div.classList.add('box');
            if (cell === '.') div.classList.add('goal');
            div.setAttribute('data-x', x);
            div.setAttribute('data-y', y);
            levelDisplay.appendChild(div);
        });
    });
}

// Solve the Sokoban level when the button is clicked
solveBtn.addEventListener('click', () => {
    if (currentLevel) {
        solutionSteps = solveSokoban(currentLevel);
        currentStep = 0;
        displaySolverSteps();
    }
});

// Display solver steps with animation
function displaySolverSteps() {
    if (currentStep < solutionSteps.length) {
        const step = solutionSteps[currentStep];
        solverSteps.innerHTML = `Step ${currentStep + 1}: ${step.type}`;
        animateSolverStep(step);
        currentStep++;
        setTimeout(displaySolverSteps, 1000);
    }
}

// Animate the player and box movements
function animateSolverStep(step) {
    const { fromPos, toPos, type } = step;
    const playerDiv = document.querySelector(`div[data-x='${fromPos.x}'][data-y='${fromPos.y}']`);
    const toDiv = document.querySelector(`div[data-x='${toPos.x}'][data-y='${toPos.y}']`);

    if (type === 'movePlayer') {
        playerDiv.classList.remove('player');
        playerDiv.classList.add('empty');
        toDiv.classList.remove('empty');
        toDiv.classList.add('player');
    } else if (type === 'moveBox') {
        const boxDiv = document.querySelector(`div[data-x='${fromPos.x}'][data-y='${fromPos.y}']`);
        boxDiv.classList.remove('box');
        boxDiv.classList.add('empty');
        toDiv.classList.remove('empty');
        toDiv.classList.add('box');
    }
}

// Sokoban solver function (unchanged)
function solveSokoban(level) {
    const { map, player, boxes, goals } = level;
    const visited = new Set();
    const queue = [{ player, boxes, moves: [] }];
    
    const directions = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 }
    ];

    while (queue.length > 0) {
        const { player: currPlayer, boxes: currBoxes, moves } = queue.shift();

        if (goalReached(currBoxes, goals)) return moves;

        directions.forEach(dir => {
            const newPlayer = { x: currPlayer.x + dir.x, y: currPlayer.y + dir.y };

            if (isValidMove(map, newPlayer, currBoxes, visited)) {
                const newBoxes = [...currBoxes];
                const newMoves = [...moves, { type: 'movePlayer', fromPos: currPlayer, toPos: newPlayer }];
                
                queue.push({ player: newPlayer, boxes: newBoxes, moves: newMoves });
                visited.add(`${newPlayer.x}-${newPlayer.y}`);
            }
        });
    }

    return [];
}

function isValidMove(map, player, boxes, visited) {
    const isWall = map[player.y][player.x] === '#';
    const isBox = boxes.some(box => box.x === player.x && box.y === player.y);
    return !isWall && !isBox && !visited.has(`${player.x}-${player.y}`);
}

function goalReached(boxes, goals) {
    return boxes.every(box => goals.some(goal => goal.x === box.x && goal.y === box.y));
}
