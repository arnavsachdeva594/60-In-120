// Set up the initial game state and canvas
const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext('2d');

// Game dimensions and tile size
const tileSize = 80;
const boardWidth = 5;
const boardHeight = 5;

// Placeholder board and game state
let board = [];

// Draw the game board based on the current state
function drawBoard() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height); // Clear canvas

  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      const tile = board[row][col];
      
      if (tile === '#') {
        ctx.fillStyle = '#333'; // Wall
        ctx.fillRect(x, y, tileSize, tileSize);
      } else if (tile === '.') {
        ctx.fillStyle = '#fff'; // Empty space
        ctx.fillRect(x, y, tileSize, tileSize);
      } else if (tile === 'P') {
        ctx.fillStyle = '#0f0'; // Player
        ctx.fillRect(x, y, tileSize, tileSize);
      } else if (tile === 'B') {
        ctx.fillStyle = '#00f'; // Box
        ctx.fillRect(x, y, tileSize, tileSize);
      }
      ctx.strokeRect(x, y, tileSize, tileSize); // Outline each tile
    }
  }
}

// Generate a random Sokoban level
function generateLevel() {
  // Simple generation algorithm: Create walls, player, box, and goal
  let newBoard = Array.from({ length: boardHeight }, () => Array(boardWidth).fill('.'));

  // Place walls around the edges
  for (let i = 0; i < boardHeight; i++) {
    for (let j = 0; j < boardWidth; j++) {
      if (i === 0 || i === boardHeight - 1 || j === 0 || j === boardWidth - 1) {
        newBoard[i][j] = '#';
      }
    }
  }

  // Randomly place player ('P') and box ('B')
  newBoard[2][2] = 'P'; // Player starting position
  newBoard[3][2] = 'B'; // Box starting position

  // Set the board state
  board = newBoard;
  drawBoard();
  document.getElementById('solveButton').disabled = false; // Enable solve button after generating a level
}

// Handle the "Solve" button click
document.getElementById('solveButton').addEventListener('click', solveGame);
document.getElementById('generateButton').addEventListener('click', generateLevel);

// Function to simulate solving the game (currently a dummy BFS)
function solveGame() {
  const solutionSteps = bfsSolve(); // Get the steps to solve the puzzle
  let currentStep = 0;
  let interval = setInterval(() => {
    if (currentStep < solutionSteps.length) {
      applyMove(solutionSteps[currentStep]);
      currentStep++;
    } else {
      clearInterval(interval);
      console.log('Game Solved');
    }
  }, 500); // Adjust step delay for visualization speed
}

// Dummy BFS solver
function bfsSolve() {
  // Dummy solution: move the player to the box and push it
  // This would be replaced with a proper algorithm (BFS, A*, etc.)

  return [
    { player: { row: 2, col: 2 }, box: { row: 3, col: 2 } },  // Initial state
    { player: { row: 2, col: 3 }, box: { row: 3, col: 2 } },
    { player: { row: 3, col: 3 }, box: { row: 3, col: 3 } },  // Final solved state
  ];
}

// Apply each move and update the game board
function applyMove(move) {
  // Update player position
  board[move.player.row][move.player.col] = 'P';

  // Update box position
  board[move.box.row][move.box.col] = 'B';

  // Redraw the updated game board
  drawBoard();
}

// Initial draw (empty level)
drawBoard();
