const ROWS = 6;
const COLS = 7;
const PLAYER = 'red';
const AI = 'yellow';

let board = [];
let gameOver = false;
let currentPlayer = PLAYER;
let vsAI = true; 

const gameDiv = document.getElementById('game');
const statusDiv = document.getElementById('status');
const modeSelect = document.getElementById('modeSelect');
const restartBtn = document.getElementById('restartBtn');
const toggleTheme = document.getElementById('toggleTheme');

modeSelect.addEventListener('change', () => {
  vsAI = modeSelect.value === 'ai';
  initBoard(); 
});

restartBtn.addEventListener('click', initBoard);

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function initBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  gameOver = false;
  currentPlayer = PLAYER; 
  statusDiv.textContent = "Your turn!";
  
  gameDiv.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', 'empty');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', handleClick);
      gameDiv.appendChild(cell);
    }
  }
}

function handleClick(e) {
  if (gameOver) return;
  
  const col = parseInt(e.target.dataset.col);
  const row = getAvailableRow(col);
  if (row === null) return; 
  
  placePiece(row, col, currentPlayer);
  updateCell(row, col, currentPlayer);

  if (checkWin(board, currentPlayer)) {
    statusDiv.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'} wins!`;
    gameOver = true;
    return;
  }

  if (isBoardFull()) {
    statusDiv.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  if (vsAI && currentPlayer === PLAYER) {
    currentPlayer = AI;
    statusDiv.textContent = "AI is thinking...";
    setTimeout(() => {
      const aiMove = getBestMove(board, 4, -Infinity, Infinity, true);
      if (aiMove && aiMove.col !== undefined) {
        const aiRow = getAvailableRow(aiMove.col);
        placePiece(aiRow, aiMove.col, AI);
        updateCell(aiRow, aiMove.col, AI);

        if (checkWin(board, AI)) {
          statusDiv.textContent = "AI wins!";
          gameOver = true;
          return;
        }

        if (isBoardFull()) {
          statusDiv.textContent = "It's a draw!";
          gameOver = true;
          return;
        }

        currentPlayer = PLAYER; 
        statusDiv.textContent = "Your turn!";
      }
    }, 500); 
  } else if (!vsAI) {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red'; 
    statusDiv.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s turn`;
  }
}

function getAvailableRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) return r;
  }
  return null;
}

function placePiece(row, col, player) {
  board[row][col] = player;
}

function updateCell(row, col, player) {
  const cells = document.querySelectorAll('.cell');
  const index = row * COLS + col;
  cells[index].classList.remove('empty');
  cells[index].classList.add(player);
}

function isBoardFull() {
  return board.every(row => row.every(cell => cell));
}

function checkWin(bd, player) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (bd[r][c] === player && bd[r][c + 1] === player && bd[r][c + 2] === player && bd[r][c + 3] === player)
        return true;
    }
  }

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      if (bd[r][c] === player && bd[r + 1][c] === player && bd[r + 2][c] === player && bd[r + 3][c] === player)
        return true;
    }
  }

  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (bd[r][c] === player && bd[r - 1][c + 1] === player && bd[r - 2][c + 2] === player && bd[r - 3][c + 3] === player)
        return true;
    }
  }

  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (bd[r][c] === player && bd[r + 1][c + 1] === player && bd[r + 2][c + 2] === player && bd[r + 3][c + 3] === player)
        return true;
    }
  }

  return false;
}

function getValidLocations(bd) {
  const valid = [];
  for (let c = 0; c < COLS; c++) {
    if (!bd[0][c]) valid.push(c);
  }
  return valid;
}

function copyBoard(bd) {
  return bd.map(row => row.slice());
}

function scorePosition(bd, player) {
  let score = 0;
  function countSequence(seq) {
    const count = seq.filter(cell => cell === player).length;
    const empty = seq.filter(cell => cell === null).length;
    if (count === 4) return 100;
    if (count === 3 && empty === 1) return 5;
    if (count === 2 && empty === 2) return 2;
    return 0;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = bd[r].slice(c, c + 4);
      score += countSequence(window);
    }
  }
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      const window = [bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c]];
      score += countSequence(window);
    }
  }
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3]];
      score += countSequence(window);
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3]];
      score += countSequence(window);
    }
  }
  return score;
}

function isTerminalNode(bd) {
  return checkWin(bd, PLAYER) || checkWin(bd, AI) || getValidLocations(bd).length === 0;
}

function getAvailableRowInBoard(bd, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!bd[r][col]) return r;
  }
  return null;
}

function getBestMove(bd, depth, alpha, beta, maximizingPlayer) {
  const validLocations = getValidLocations(bd);
  const isTerminal = isTerminalNode(bd);
  if (depth === 0 || isTerminal) {
    return { score: scorePosition(bd, PLAYER) };
  }

  let bestMove = { score: maximizingPlayer ? -Infinity : Infinity };

  validLocations.forEach(col => {
    const row = getAvailableRowInBoard(bd, col);
    const newBd = copyBoard(bd);
    newBd[row][col] = maximizingPlayer ? AI : PLAYER;

    const moveScore = getBestMove(newBd, depth - 1, alpha, beta, !maximizingPlayer).score;
    bestMove = { col, score: moveScore };

    if (maximizingPlayer) {
      alpha = Math.max(alpha, bestMove.score);
      if (beta <= alpha) return bestMove;
    } else {
      beta = Math.min(beta, bestMove.score);
      if (beta <= alpha) return bestMove;
    }
  });

  return bestMove;
}

initBoard(); 
