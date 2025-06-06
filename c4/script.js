<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Connect Four with Stronger AI</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }
    #controls {
      margin-bottom: 10px;
    }
    #game {
      display: grid;
      grid-template-columns: repeat(7, 60px);
      grid-template-rows: repeat(6, 60px);
      gap: 4px;
    }
    .cell {
      width: 60px;
      height: 60px;
      background-color: #eee;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
    }
    .cell.empty:hover {
      box-shadow: inset 0 0 0 4px rgba(0,0,0,0.2);
    }
    .red {
      background-color: crimson;
    }
    .yellow {
      background-color: gold;
    }
    #status {
      margin-top: 10px;
      font-size: 1.2rem;
    }
    .dark {
      background-color: #222;
      color: #ddd;
    }
    .dark .cell {
      background-color: #444;
    }
    .dark .cell.empty:hover {
      box-shadow: inset 0 0 0 4px rgba(255,255,255,0.2);
    }
  </style>
</head>
<body>
  <div id="controls">
    <label for="modeSelect">Mode: </label>
    <select id="modeSelect">
      <option value="ai">Player vs AI</option>
      <option value="pvp">Player vs Player</option>
    </select>
    <button id="restartBtn">Restart</button>
    <button id="toggleTheme">Toggle Dark/Light</button>
  </div>
  <div id="game"></div>
  <div id="status"></div>

  <script>
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
        statusDiv.textContent = `${capitalize(currentPlayer)} wins!`;
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
          const { col: aiCol } = getBestMove(board, 5, -Infinity, Infinity, true);
          const aiRow = getAvailableRowInBoard(board, aiCol);
          placePiece(aiRow, aiCol, AI);
          updateCell(aiRow, aiCol, AI);

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
        }, 300);
      } else if (!vsAI) {
        currentPlayer = (currentPlayer === PLAYER) ? AI : PLAYER;
        statusDiv.textContent = `${capitalize(currentPlayer)}'s turn`;
      }
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
          if (bd[r][c] === player &&
              bd[r][c + 1] === player &&
              bd[r][c + 2] === player &&
              bd[r][c + 3] === player) {
            return true;
          }
        }
      }
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r <= ROWS - 4; r++) {
          if (bd[r][c] === player &&
              bd[r + 1][c] === player &&
              bd[r + 2][c] === player &&
              bd[r + 3][c] === player) {
            return true;
          }
        }
      }
      for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          if (bd[r][c] === player &&
              bd[r + 1][c + 1] === player &&
              bd[r + 2][c + 2] === player &&
              bd[r + 3][c + 3] === player) {
            return true;
          }
        }
      }
      for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          if (bd[r][c] === player &&
              bd[r - 1][c + 1] === player &&
              bd[r - 2][c + 2] === player &&
              bd[r - 3][c + 3] === player) {
            return true;
          }
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

    function scorePosition(bd, playerToScore) {
      let score = 0;

      const centerArray = bd.map(row => row[Math.floor(COLS / 2)]);
      const centerCount = centerArray.filter(cell => cell === AI).length;
      if (playerToScore === AI) {
        score += centerCount * 3;
      }

      function countWindow(window, player) {
        const playerCount = window.filter(cell => cell === player).length;
        const emptyCount = window.filter(cell => cell === null).length;

        if (playerCount === 4) {
          return 100;
        } else if (playerCount === 3 && emptyCount === 1) {
          return 5;
        } else if (playerCount === 2 && emptyCount === 2) {
          return 2;
        }
        return 0;
      }

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          const window = [bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3]];
          score += countWindow(window, playerToScore);
        }
      }

      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r <= ROWS - 4; r++) {
          const window = [
            bd[r][c],
            bd[r + 1][c],
            bd[r + 2][c],
            bd[r + 3][c],
          ];
          score += countWindow(window, playerToScore);
        }
      }

      for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          const window = [
            bd[r][c],
            bd[r + 1][c + 1],
            bd[r + 2][c + 2],
            bd[r + 3][c + 3],
          ];
          score += countWindow(window, playerToScore);
        }
      }

      for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          const window = [
            bd[r][c],
            bd[r - 1][c + 1],
            bd[r - 2][c + 2],
            bd[r - 3][c + 3],
          ];
          score += countWindow(window, playerToScore);
        }
      }

      return score;
    }

    function isTerminalNode(bd) {
      return (
        checkWin(bd, PLAYER) ||
        checkWin(bd, AI) ||
        getValidLocations(bd).length === 0
      );
    }

    /**
     * Minimax with Alpha‐Beta on a Connect Four board:
     * @param {Array<Array<string|null>>} bd – current board
     * @param {number} depth – how many plies to look ahead
     * @param {number} alpha 
     * @param {number} beta 
     * @param {boolean} maximizingPlayer – true iff it’s the AI’s turn
     * @returns {{ col: number, score: number }} – best column & its score
     */
    function getBestMove(bd, depth, alpha, beta, maximizingPlayer) {
      const validLocations = getValidLocations(bd);
      const isTerminal = isTerminalNode(bd);

      if (depth === 0 || isTerminal) {
        if (isTerminal) {
          if (checkWin(bd, AI)) {
            return { col: null, score: 1e6 }; 
          } else if (checkWin(bd, PLAYER)) {
            return { col: null, score: -1e6 }; 
          } else {
            return { col: null, score: 0 };
          }
        } else {
          const scoreFor = maximizingPlayer ? AI : PLAYER;
          return { col: null, score: scorePosition(bd, scoreFor) };
        }
      }

      if (maximizingPlayer) {
        let value = -Infinity;
        let bestCol = validLocations[0];

        for (let col of validLocations) {
          const row = getAvailableRowInBoard(bd, col);
          const tempBoard = copyBoard(bd);
          tempBoard[row][col] = AI;

          const newScoreObj = getBestMove(tempBoard, depth - 1, alpha, beta, false);
          if (newScoreObj.score > value) {
            value = newScoreObj.score;
            bestCol = col;
          }
          alpha = Math.max(alpha, value);
          if (alpha >= beta) {
            break; 
          }
        }
        return { col: bestCol, score: value };
      } else {
        let value = Infinity;
        let bestCol = validLocations[0];

        for (let col of validLocations) {
          const row = getAvailableRowInBoard(bd, col);
          const tempBoard = copyBoard(bd);
          tempBoard[row][col] = PLAYER;

          const newScoreObj = getBestMove(tempBoard, depth - 1, alpha, beta, true);
          if (newScoreObj.score < value) {
            value = newScoreObj.score;
            bestCol = col;
          }
          beta = Math.min(beta, value);
          if (alpha >= beta) {
            break; 
          }
        }
        return { col: bestCol, score: value };
      }
    }

    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // Initialize game on load
    initBoard();
  </script>
</body>
</html>
