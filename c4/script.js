<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Connect Four with Improved AI</title>
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
          // Call minimax with depth=5 (you can try 4 or 6 to adjust speed/strength)
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
        // PvP mode
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
      // Horizontal
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
      // Vertical
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
      // Diagonal “\”
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
      // Diagonal “/”
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

    // Heuristic: “AI’s count” minus “Player’s count” in every possible 4-slot window.
    function scorePosition(bd, playerToScore) {
      let score = 0;

      // Center bonus (encourage AI to take column 3)
      const centerArray = bd.map(row => row[Math.floor(COLS / 2)]);
      const centerCount = centerArray.filter(cell => cell === AI).length;
      if (playerToScore === AI) {
        score += centerCount * 3;
      }

      function countWindow(window, player) {
        const countPlayer = window.filter(cell => cell === player).length;
        const countEmpty  = window.filter(cell => cell === null).length;
        if (countPlayer === 4) return 100;
        if (countPlayer === 3 && countEmpty === 1) return 5;
        if (countPlayer === 2 && countEmpty === 2) return 2;
        return 0;
      }

      // Horizontal
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          const window = [bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3]];
          score += countWindow(window, playerToScore);
        }
      }
      // Vertical
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r <= ROWS - 4; r++) {
          const window = [
            bd[r][c],
            bd[r + 1][c],
            bd[r + 2][c],
            bd[r + 3][c]
          ];
          score += countWindow(window, playerToScore);
        }
      }
      // Diagonal “\”
      for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          const window = [
            bd[r][c],
            bd[r + 1][c + 1],
            bd[r + 2][c + 2],
            bd[r + 3][c + 3]
          ];
          score += countWindow(window, playerToScore);
        }
      }
      // Diagonal “/”
      for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
          const window = [
            bd[r][c],
            bd[r - 1][c + 1],
            bd[r - 2][c + 2],
            bd[r - 3][c + 3]
          ];
          score += countWindow(window, playerToScore);
        }
      }

      return score;
    }

    // Zero-sum heuristic: AI’s score minus Player’s score
    function heuristicValue(bd) {
      return scorePosition(bd, AI) - scorePosition(bd, PLAYER);
    }

    function isTerminalNode(bd) {
      return (
        checkWin(bd, PLAYER) ||
        checkWin(bd, AI)     ||
        getValidLocations(bd).length === 0
      );
    }

    /**
     * Minimax with alpha-beta pruning and center-based ordering.
     * Returns { col, score }.
     */
    function getBestMove(bd, depth, alpha, beta, maximizingPlayer) {
      const allLocations = getValidLocations(bd);
      // Order moves: center first → then outward
      const order = [3, 2, 4, 1, 5, 0, 6];
      const validLocations = order.filter(c => allLocations.includes(c));

      const terminal = isTerminalNode(bd);
      if (depth === 0 || terminal) {
        if (terminal) {
          if (checkWin(bd, AI)) return { col: null, score: 1e6 };
          if (checkWin(bd, PLAYER)) return { col: null, score: -1e6 };
          return { col: null, score: 0 }; // draw
        }
        // Depth=0 but not terminal: use zero-sum heuristic
        return { col: null, score: heuristicValue(bd) };
      }

      if (maximizingPlayer) {
        // AI to play → maximize heuristic
        let value = -Infinity;
        let bestCol = validLocations[0];
        for (let col of validLocations) {
          const row = getAvailableRowInBoard(bd, col);
          const temp = copyBoard(bd);
          temp[row][col] = AI;

          const { score: newScore } = getBestMove(temp, depth - 1, alpha, beta, false);
          if (newScore > value) {
            value = newScore;
            bestCol = col;
          }
          alpha = Math.max(alpha, value);
          if (alpha >= beta) {
            break; // β cutoff
          }
        }
        return { col: bestCol, score: value };
      } else {
        // PLAYER to play → minimize heuristic
        let value = Infinity;
        let bestCol = validLocations[0];
        for (let col of validLocations) {
          const row = getAvailableRowInBoard(bd, col);
          const temp = copyBoard(bd);
          temp[row][col] = PLAYER;

          const { score: newScore } = getBestMove(temp, depth - 1, alpha, beta, true);
          if (newScore < value) {
            value = newScore;
            bestCol = col;
          }
          beta = Math.min(beta, value);
          if (alpha >= beta) {
            break; // α cutoff
          }
        }
        return { col: bestCol, score: value };
      }
    }

    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // Kick off the first board
    initBoard();
  </script>
</body>
</html>
