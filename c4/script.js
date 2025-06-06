'use strict';

/* ========================================================================
 * Algorithm.js (adapted from lgfischer/connect-four-js)
 * ======================================================================== */

function Algorithm() {
    this.player = 'yellow';       // By default we'll set AI to 'yellow'
    this.otherPlayer = null;

    const rows = 6;
    const columns = 7;
    this.gameBoard = null;        // Will hold a 7×6 array: gameBoard[col][row]

    const maxLevel = 4;           // you can adjust search depth

    /**
     * Called by the game when it's the AI's turn.
     * availableColumns: array of column indices that are not full (e.g. [0,1,2,3,4,5,6])
     * gameBoard: current board as a 7×6 2D array (columns first, rows second)
     * Returns: a single column index (0–6) where the AI wants to drop.
     */
    this.move = function (availableColumns, gameBoard) {
        this.gameBoard = gameBoard;
        this.otherPlayer = this.getOtherPlayer(this.player);

        if (this.otherPlayer !== null) {
            // Run minimax with alpha-beta pruning
            const result = this.minmaxWithAlphaBetaPruning(
                this.getAvailableMoves(),
                true,           // maximizingPlayer (AI’s turn)
                maxLevel,
                Number.NEGATIVE_INFINITY,
                Number.POSITIVE_INFINITY
            );
            return result.move;
        } else {
            // If AI is starting (no other pieces on board), play center
            return Math.floor(columns / 2);
        }
    };

    /* ====================================================================
     * GAME RULES / BOARD MANIPULATION
     * ==================================================================== */

    // Return array of columns (0..6) where top row is still null
    this.getAvailableMoves = function () {
        const moves = [];
        for (let c = 0; c < columns; c++) {
            if (this.getPlace(c, 0) === null) {
                moves.push(c);
            }
        }
        return moves;
    };

    // Return true if the specified player occupies (column, row).
    // currentPlayerFlag === true means check for this.player; false means check for opponent.
    this.isPlayerAt = function (column, row, currentPlayerFlag) {
        const occupant = this.getPlace(column, row);
        if (occupant === null) return false;
        if (currentPlayerFlag) return occupant === this.player;
        return occupant === this.otherPlayer;
    };

    // Get what's at (column, row): either 'red', 'yellow', or null
    this.getPlace = function (column, row) {
        return this.gameBoard[column][row];
    };

    // Set (column, row) to a player string, or null to clear
    this.setPlace = function (column, row, player) {
        this.gameBoard[column][row] = player;
    };

    // Drop a piece into the given column for the given player.
    // It will occupy the lowest empty row in that column.
    this.doMove = function (column, player) {
        for (let r = rows - 1; r >= 0; r--) {
            if (this.getPlace(column, r) === null) {
                this.setPlace(column, r, player);
                return;
            }
        }
    };

    // Remove the topmost piece from the given column.
    this.undoMove = function (column) {
        for (let r = 0; r < rows; r++) {
            if (this.getPlace(column, r) !== null) {
                this.setPlace(column, r, null);
                return;
            }
        }
    };

    // Returns true if 'currentPlayerFlag' (true → this.player, false → opponent) has 4 in a row anywhere.
    this.isVictory = function (currentPlayerFlag) {
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                if (this.isPlayerAt(c, r, currentPlayerFlag)) {
                    // Vertical (downwards)
                    if (r <= rows - 4) {
                        let win = true;
                        for (let i = 0; i < 4; i++) {
                            if (!this.isPlayerAt(c, r + i, currentPlayerFlag)) {
                                win = false;
                                break;
                            }
                        }
                        if (win) return true;
                    }
                    // Horizontal (to the right)
                    if (c <= columns - 4) {
                        let win = true;
                        for (let i = 0; i < 4; i++) {
                            if (!this.isPlayerAt(c + i, r, currentPlayerFlag)) {
                                win = false;
                                break;
                            }
                        }
                        if (win) return true;
                    }
                    // Diagonal “\” (down-right)
                    if (c <= columns - 4 && r <= rows - 4) {
                        let win = true;
                        for (let i = 0; i < 4; i++) {
                            if (!this.isPlayerAt(c + i, r + i, currentPlayerFlag)) {
                                win = false;
                                break;
                            }
                        }
                        if (win) return true;
                    }
                    // Diagonal “/” (up-right)
                    if (c <= columns - 4 && r >= 3) {
                        let win = true;
                        for (let i = 0; i < 4; i++) {
                            if (!this.isPlayerAt(c + i, r - i, currentPlayerFlag)) {
                                win = false;
                                break;
                            }
                        }
                        if (win) return true;
                    }
                }
            }
        }
        return false;
    };

    // Find the other player's string by scanning the board once.
    this.getOtherPlayer = function (player) {
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                const place = this.getPlace(c, r);
                if (place !== null && place !== player) {
                    return place;
                }
            }
        }
        return null;
    };

    /* ====================================================================
     * SCORING / HEURISTIC
     * ==================================================================== */

    // Evaluate a 4-slot or 5-slot “window” (array of length 4 or 5) for how valuable it is.
    this.evaluatePlaces = function (places, isCurrentPlayer) {
        const length = places.length;
        let nullCount = 0,
            playerCount = 0,
            opponentCount = 0;

        for (let i = 0; i < length; i++) {
            if (places[i] === null) {
                nullCount++;
            } else if (places[i] === this.player) {
                if (isCurrentPlayer) playerCount++;
                else opponentCount++;
            } else {
                // places[i] must be opponent
                if (isCurrentPlayer) opponentCount++;
                else playerCount++;
            }
        }

        if (length === 5 && opponentCount !== 0) {
            // special 5-slot patterns:
            // | |P|P|P| | → 40
            // |P|P| |P| | → 30
            // | |P|P| |P| → 30
            // |P| |P|P| | → 30
            // | |P| |P|P| → 30
            // | |P| |P| | → 30
            if (playerCount === 3) {
                // check all patterns of three P's in these 5 slots:
                if (
                    (places[1] !== null && places[2] !== null && places[3] !== null) ||
                    (places[0] !== null && places[1] !== null && places[3] !== null) ||
                    (places[1] !== null && places[2] !== null && places[4] !== null) ||
                    (places[0] !== null && places[2] !== null && places[3] !== null) ||
                    (places[1] !== null && places[3] !== null && places[4] !== null)
                ) {
                    return  (places[1] !== null && places[2] !== null && places[3] !== null) ? 40 : 30;
                }
            }
            if (playerCount === 2 && places[1] !== null && places[3] !== null) {
                return 30;
            }
            return 0;
        }

        if (opponentCount !== 0) {
            return 0;
        } else {
            if (playerCount === 1) return 1;
            if (playerCount === 2) return 4;
            if (playerCount === 3) return 8;
            return playerCount;
        }
    };

    // Score the entire board from the perspective of `isCurrentPlayer` (true → this.player, false → opponent).
    this.getGameScore = function (isCurrentPlayer) {
        let score = 0;
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                // Vertical (exactly 4 slots)
                if (r <= rows - 4) {
                    const places = [];
                    for (let i = 0; i < 4; i++) {
                        places.push(this.getPlace(c, r + i));
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
                // Horizontal (exactly 5 slots)
                if (c <= columns - 5) {
                    const places = [];
                    for (let i = 0; i < 5; i++) {
                        places.push(this.getPlace(c + i, r));
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
                // Diagonal “\” (exactly 4 slots)
                if (c <= columns - 4 && r <= rows - 4) {
                    const places = [];
                    for (let i = 0; i < 4; i++) {
                        places.push(this.getPlace(c + i, r + i));
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
                // Diagonal “/” (exactly 4 slots)
                if (c <= columns - 4 && r >= 3) {
                    const places = [];
                    for (let i = 0; i < 4; i++) {
                        places.push(this.getPlace(c + i, r - i));
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
            }
        }
        return score;
    };

    // If a board is in a winning state (for either player) or depth ≤ 0, return a large positive/negative score.
    this.gameScore = function (currentPlayerFlag, level) {
        if (this.isVictory(currentPlayerFlag)) {
            // If currentPlayerFlag===true, that means we just gave the AI a winning move.
            return currentPlayerFlag ? 10000 : -10000;
        }
        return this.getGameScore(currentPlayerFlag);
    };

    /* ====================================================================
     * MINIMAX WITH ALPHA-BETA PRUNING
     * ==================================================================== */

    /**
     * @param {number[]} availableMoves    – array of column indices still open
     * @param {boolean} currentPlayerFlag  – true if simulating for this.player (AI), false if simulating for opponent
     * @param {number} level               – how many plies left in the search
     * @param {number} alpha               – current α value (lower bound for maximizing)
     * @param {number} beta                – current β value (upper bound for minimizing)
     * @returns {{score: number, move: number|null}}
     */
    this.minmaxWithAlphaBetaPruning = function (availableMoves, currentPlayerFlag, level, alpha, beta) {
        // Terminal or depth = 0
        if (availableMoves.length === 0 || level <= 0 || this.isVictory(currentPlayerFlag)) {
            const s = this.gameScore(currentPlayerFlag, level);
            return { score: s, move: null };
        }

        let best = {
            score: currentPlayerFlag ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            move: null
        };

        // Order moves center → outward for better pruning
        const moveOrder = [3, 2, 4, 1, 5, 0, 6];
        const validLocations = moveOrder.filter(c => availableMoves.includes(c));

        for (let col of validLocations) {
            // Adjust α/β based on current best
            if (currentPlayerFlag) {
                if (best.score > alpha) alpha = best.score;
            } else {
                if (best.score < beta) beta = best.score;
            }

            // Simulate move
            const playerStr = currentPlayerFlag ? this.player : this.otherPlayer;
            this.doMove(col, playerStr);

            // Recurse with switched player flag and reduced depth
            const nextAvailable = this.getAvailableMoves();
            const node = this.minmaxWithAlphaBetaPruning(
                nextAvailable,
                !currentPlayerFlag,
                level - 1,
                -beta,
                -alpha
            );
            // Negate the returned score (zero-sum)
            const nodeScore = -node.score;

            // Undo the move
            this.undoMove(col);

            if (currentPlayerFlag) {
                // Maximizing for AI
                if (nodeScore > best.score) {
                    best.score = nodeScore;
                    best.move = col;
                }
                if (best.score > beta) {
                    break; // β-cutoff
                }
            } else {
                // Minimizing for opponent
                if (nodeScore < best.score) {
                    best.score = nodeScore;
                    best.move = col;
                }
                if (best.score < alpha) {
                    break; // α-cutoff
                }
            }
        }

        return best;
    };
}


/* ========================================================================
 * script.js (integrating Algorithm into a standalone Connect Four game)
 * ======================================================================== */

const ROWS = 6;
const COLS = 7;
const PLAYER = 'red';        // human is 'red'
const AI_PIECE = 'yellow';   // AI is 'yellow'

let board = [];              // will be a 7×6 array: board[col][row]
let gameOver = false;
let currentPlayer = PLAYER;
let vsAI = true;

const gameDiv = document.getElementById('game');
const statusDiv = document.getElementById('status');
const modeSelect = document.getElementById('modeSelect');
const restartBtn = document.getElementById('restartBtn');
const toggleTheme = document.getElementById('toggleTheme');

// Instantiate Algorithm and set its player string to match AI_PIECE
const aiAgent = new Algorithm();
aiAgent.player = AI_PIECE;

// === Setup event listeners ===
modeSelect.addEventListener('change', () => {
    vsAI = modeSelect.value === 'ai';
    initBoard();
});
restartBtn.addEventListener('click', initBoard);
toggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// === Initialize / Reset the board ===
function initBoard() {
    // Create empty 7×6 array (columns × rows) filled with null
    board = Array.from({ length: COLS }, () => Array(ROWS).fill(null));
    gameOver = false;
    currentPlayer = PLAYER;
    statusDiv.textContent = "Your turn!";

    // Build the DOM grid, row-major order, but board is column-major internally
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

// Kick off first board
initBoard();

// === Click handler (human move) ===
function handleClick(e) {
    if (gameOver) return;

    const col = parseInt(e.target.dataset.col, 10);
    const row = getAvailableRow(col);
    if (row === null) return; // Column is full

    // Place the human's piece
    placePiece(col, row, PLAYER);
    updateCell(col, row, PLAYER);

    // Check if human won
    if (checkWin(PLAYER)) {
        statusDiv.textContent = "Red wins!";
        gameOver = true;
        return;
    }
    if (isBoardFull()) {
        statusDiv.textContent = "It's a draw!";
        gameOver = true;
        return;
    }

    // If playing vs AI, let AI move now
    if (vsAI && currentPlayer === PLAYER) {
        currentPlayer = AI_PIECE;
        statusDiv.textContent = "AI is thinking...";
        setTimeout(() => {
            const availableCols = getAvailableColumns();
            // Let Algorithm pick a move
            const aiCol = aiAgent.move(availableCols, board);
            const aiRow = getAvailableRow(aiCol);

            // Place AI piece
            placePiece(aiCol, aiRow, AI_PIECE);
            updateCell(aiCol, aiRow, AI_PIECE);

            // Check if AI won
            if (checkWin(AI_PIECE)) {
                statusDiv.textContent = "Yellow (AI) wins!";
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
        // PvP mode: toggle currentPlayer and update status
        currentPlayer = (currentPlayer === PLAYER) ? AI_PIECE : PLAYER;
        statusDiv.textContent = `${capitalize(currentPlayer)}'s turn`;
    }
}

// === Board utility functions ===

// Return the first empty row (bottom-up) in column `col`, or null if full
function getAvailableRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[col][r] === null) return r;
    }
    return null;
}

// Return an array of column indices that are not full
function getAvailableColumns() {
    const cols = [];
    for (let c = 0; c < COLS; c++) {
        if (board[c][0] === null) cols.push(c);
    }
    return cols;
}

// Place `player` (‘red’ or ‘yellow’) at (col, row) in our internal board
function placePiece(col, row, player) {
    board[col][row] = player;
}

// Update the DOM cell color at (col, row)
function updateCell(col, row, player) {
    const cells = document.querySelectorAll('.cell');
    const index = row * COLS + col;   // row-major index
    cells[index].classList.remove('empty');
    cells[index].classList.add(player);
}

// Return true if every cell is non-null
function isBoardFull() {
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
            if (board[c][r] === null) return false;
        }
    }
    return true;
}

// Check if `player` has 4 in a row anywhere
function checkWin(player) {
    // Vertical
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r <= ROWS - 4; r++) {
            if (
                board[c][r] === player &&
                board[c][r + 1] === player &&
                board[c][r + 2] === player &&
                board[c][r + 3] === player
            ) {
                return true;
            }
        }
    }
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (
                board[c][r] === player &&
                board[c + 1][r] === player &&
                board[c + 2][r] === player &&
                board[c + 3][r] === player
            ) {
                return true;
            }
        }
    }
    // Diagonal “\”
    for (let c = 0; c <= COLS - 4; c++) {
        for (let r = 0; r <= ROWS - 4; r++) {
            if (
                board[c][r] === player &&
                board[c + 1][r + 1] === player &&
                board[c + 2][r + 2] === player &&
                board[c + 3][r + 3] === player
            ) {
                return true;
            }
        }
    }
    // Diagonal “/”
    for (let c = 0; c <= COLS - 4; c++) {
        for (let r = 3; r < ROWS; r++) {
            if (
                board[c][r] === player &&
                board[c + 1][r - 1] === player &&
                board[c + 2][r - 2] === player &&
                board[c + 3][r - 3] === player
            ) {
                return true;
            }
        }
    }
    return false;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
