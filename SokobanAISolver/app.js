// Set up the initial game state
const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext('2d');

// Placeholder for the initial Sokoban board state (a simple 5x5 example)
let board = [
  ['#', '#', '#', '#', '#'],
  ['#', '.', '.', '.', '#'],
  ['#', '.', 'P', '.', '#'],
  ['#', '.', 'B', '.', '#'],
  ['#', '#', '#', '#', '#']
];

// Draw the initial board on the canvas
function drawBoard() {
  const tileSize = 80;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      const tile = board[row][col];
      
      if (tile === '#') {
        ctx.fillStyle = '#333';  // Wall
        ctx.fillRect(x, y, tileSize, tileSize);
      } else if (tile === '.') {
        ctx.fillStyle = '#fff';  // Empty space
        ctx.fillRect(x, y, tileSize, tileSize);
      } else if (tile === 'P') {
        ctx.fillStyle = '#0f0';  // Player
        ctx.fillRect(x, y, tileSize, tileSize);
      } else if (tile === 'B') {
        ctx.fillStyle = '#00f';  // Box
        ctx.fillRect(x, y, tileSize, tileSize);
      }
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }
}

// Handle the "Solve" button click
document.getElementById('solveButton').addEventListener('click', solveGame);

// Function to simulate a game-solving algorithm (BFS in this case)
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
  }, 500);  // Adjust step delay for visualization speed
}

// Basic BFS algorithm to simulate solving
function bfsSolve() {
  // Dummy solution: move the player to the box and push it
  // In a real case, implement your BFS algorithm here

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

// Initial draw
drawBoard();
