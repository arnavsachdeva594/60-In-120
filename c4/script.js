const ROWS = 6;
const COLS = 7;
const PLAYER = 'red';
const AI = 'yellow';
let board = [];
let gameOver = false;

const gameDiv = document.getElementById('game');
const statusDiv = document.getElementById('status');

function initBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
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
  statusDiv.textContent = "Your turn!";
  gameOver = false;
}

function handleClick(e) {
  if (gameOver) return;
  const col = parseInt(e.target.dataset.col);
  const row = getAvailableRow(col);
  if (row === null) return;

  placePiece(row, col, PLAYER);
  updateCell(row, col, PLAYER);

  if (checkWin(board, PLAYER)) {
    statusDiv.textContent = "You win!";
    gameOver = true;
    return;
  }

  if (isBoardFull()) {
    statusDiv.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

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

      statusDiv.textContent = "Your turn!";
    }
  }, 500);
}

function getAvailableRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) return r;
  }
  return null;
}

function getAvailableRowInBoard(bd, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!bd[r][col]) return r;
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
      if (bd[r][c] === player && bd[r][c+1] === player && bd[r][c+2] === player && bd[r][c+3] === player)
        return true;
    }
  }
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      if (bd[r][c] === player && bd[r+1][c] === player && bd[r+2][c] === player && bd[r+3][c] === player)
        return true;
    }
  }
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (bd[r][c] === player && bd[r-1][c+1] === player && bd[r-2][c+2] === player && bd[r-3][c+3] === player)
        return true;
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (bd[r][c] === player && bd[r+1][c+1] === player && bd[r+2][c+2] === player && bd[r+3][c+3] === player)
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
      const window = [bd[r][c], bd[r+1][c], bd[r+2][c], bd[r+3][c]];
      score += countSequence(window);
    }
  }
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [bd[r][c], bd[r-1][c+1], bd[r-2][c+2], bd[r-3][c+3]];
      score += countSequence(window);
    }
  }
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [bd[r][c], bd[r+1][c+1], bd[r+2][c+2], bd[r+3][c+3]];
      score += countSequence(window);
    }
  }
  return score;
}

function isTerminalNode(bd) {
  return checkWin(bd, PLAYER) || checkWin(bd, AI) || getValidLocations(bd).length === 0;
}

function getBestMove(bd, depth, alpha, beta, maximizingPlayer) {
  const validLocations = getValidLocations(bd);
  const isTerminal = isTerminalNode(bd);
  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (checkWin(bd, AI)) return { score: 1000000 };
      else if (checkWin(bd, PLAYER)) return { score: -1000000 };
      else return { score: 0 };
    }
    return { score: scorePosition(bd, AI) };
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getAvailableRowInBoard(bd, col);
      if (row !== null) {
        const tempBoard = copyBoard(bd);
        tempBoard[row][col] = AI;
        const newScore = getBestMove(tempBoard, depth - 1, alpha, beta, false).score;
        if (newScore > value) {
          value = newScore;
          column = col;
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
    }
    return { col: column, score: value };
  } else {
    let value = Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getAvailableRowInBoard(bd, col);
      if (row !== null) {
        const tempBoard = copyBoard(bd);
        tempBoard[row][col] = PLAYER;
        const newScore = getBestMove(tempBoard, depth - 1, alpha, beta, true).score;
        if (newScore < value) {
          value = newScore;
          column = col;
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
    }
    return { col: column, score: value };
  }
}

window.onload = initBoard;
