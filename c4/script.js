'use strict';

/* ========================================================================
 * Algorithm.js (adapted from lgfischer/connect-four-js)
 * ======================================================================== */

function Algorithm() {
    this.player = 'yellow';      
    this.otherPlayer = null;

    const rows = 6;
    const columns = 7;
    this.gameBoard = null;       

    const maxLevel = 4;          

    this.move = function (availableColumns, gameBoard) {
        this.gameBoard = gameBoard;
        this.otherPlayer = this.getOtherPlayer(this.player);

        if (this.otherPlayer !== null) {
            const result = this.minmaxWithAlphaBetaPruning(
                this.getAvailableMoves(),
                true,          
                maxLevel,
                Number.NEGATIVE_INFINITY,
                Number.POSITIVE_INFINITY
            );
            return result.move;
        } else {
            return Math.floor(columns / 2);
        }
    };

    /* ====================================================================
     * GAME RULES / BOARD MANIPULATION
     * ==================================================================== */

    this.getAvailableMoves = function () {
        const moves = [];
        for (let c = 0; c < columns; c++) {
            if (this.getPlace(c, 0) === null) {
                moves.push(c);
            }
        }
        return moves;
    };

    this.isPlayerAt = function (column, row, currentPlayerFlag) {
        const occupant = this.getPlace(column, row);
        if (occupant === null) return false;
        if (currentPlayerFlag) return occupant === this.player;
        return occupant === this.otherPlayer;
    };

    this.getPlace = function (column, row) {
        return this.gameBoard[column][row];
    };

    this.setPlace = function (column, row, player) {
        this.gameBoard[column][row] = player;
    };

    this.doMove = function (column, player) {
        for (let r = rows - 1; r >= 0; r--) {
            if (this.getPlace(column, r) === null) {
                this.setPlace(column, r, player);
                return;
            }
        }
    };

    this.undoMove = function (column) {
        for (let r = 0; r < rows; r++) {
            if (this.getPlace(column, r) !== null) {
                this.setPlace(column, r, null);
                return;
            }
        }
    };

    this.isVictory = function (currentPlayerFlag) {
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                if (this.isPlayerAt(c, r, currentPlayerFlag)) {
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
                if (isCurrentPlayer) opponentCount++;
                else playerCount++;
            }
        }

        if (length === 5 && opponentCount !== 0) {
            if (playerCount === 3) {
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

    this.getGameScore = function (isCurrentPlayer) {
        let score = 0;
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                if (r <= rows - 4) {
                    const places = [];
                    for (let i = 0; i < 4; i++) {
                        places.push(this.getPlace(c, r + i));
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
                if (c <= columns - 5) {
                    const places = [];
                    for (let i = 0; i < 5; i++) {
                        places.push(this.getPlace(c + i, r));
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
                if (c <= columns - 4 && r <= rows - 4) {
                    const places = [];
                    for (let i = 0; i < 4; i++) {
                        places.push(this.getPlace(c + i, r + i));
                    }
                    score += this.evaluatePlaces(places, isCurrentPlayer);
                }
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

    this.gameScore = function (currentPlayerFlag, level) {
        if (this.isVictory(currentPlayerFlag)) {
            return currentPlayerFlag ? 10000 : -10000;
        }
        return this.getGameScore(currentPlayerFlag);
    };

    /* ====================================================================
     * MINIMAX WITH ALPHA-BETA PRUNING
     * ==================================================================== */

    /**
     * @param {number[]} availableMoves    
     * @param {boolean} currentPlayerFlag  
     * @param {number} level               
     * @param {number} alpha               
     * @param {number} beta                
     * @returns {{score: number, move: number|null}}
     */
    this.minmaxWithAlphaBetaPruning = function (availableMoves, currentPlayerFlag, level, alpha, beta) {
        if (availableMoves.length === 0 || level <= 0 || this.isVictory(currentPlayerFlag)) {
            const s = this.gameScore(currentPlayerFlag, level);
            return { score: s, move: null };
        }

        let best = {
            score: currentPlayerFlag ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            move: null
        };

        const moveOrder = [3, 2, 4, 1, 5, 0, 6];
        const validLocations = moveOrder.filter(c => availableMoves.includes(c));

        for (let col of validLocations) {
            if (currentPlayerFlag) {
                if (best.score > alpha) alpha = best.score;
            } else {
                if (best.score < beta) beta = best.score;
            }

            const playerStr = currentPlayerFlag ? this.player : this.otherPlayer;
            this.doMove(col, playerStr);

            const nextAvailable = this.getAvailableMoves();
            const node = this.minmaxWithAlphaBetaPruning(
                nextAvailable,
                !currentPlayerFlag,
                level - 1,
                -beta,
                -alpha
            );
            const nodeScore = -node.score;

            this.undoMove(col);

            if (currentPlayerFlag) {
                if (nodeScore > best.score) {
                    best.score = nodeScore;
                    best.move = col;
                }
                if (best.score > beta) {
                    break; 
                }
            } else {
                if (nodeScore < best.score) {
                    best.score = nodeScore;
                    best.move = col;
                }
                if (best.score < alpha) {
                    break; 
                }
            }
        }

        return best;
    };
}


/* ========================================================================
 * script.js 
 * ======================================================================== */

const ROWS = 6;
const COLS = 7;
const PLAYER = 'red';        
const AI_PIECE = 'yellow';   

let board = [];              
let gameOver = false;
let currentPlayer = PLAYER;
let vsAI = true;

const gameDiv = document.getElementById('game');
const statusDiv = document.getElementById('status');
const modeSelect = document.getElementById('modeSelect');
const restartBtn = document.getElementById('restartBtn');
const toggleTheme = document.getElementById('toggleTheme');

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
    board = Array.from({ length: COLS }, () => Array(ROWS).fill(null));
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

initBoard();

// === Click handler (human move) ===
function handleClick(e) {
    if (gameOver) return;

    const col = parseInt(e.target.dataset.col, 10);
    const row = getAvailableRow(col);
    if (row === null) return; 

    placePiece(col, row, PLAYER);
    updateCell(col, row, PLAYER);

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

    if (vsAI && currentPlayer === PLAYER) {
        currentPlayer = AI_PIECE;
        statusDiv.textContent = "AI is thinking...";
        setTimeout(() => {
            const availableCols = getAvailableColumns();
            const aiCol = aiAgent.move(availableCols, board);
            const aiRow = getAvailableRow(aiCol);

            placePiece(aiCol, aiRow, AI_PIECE);
            updateCell(aiCol, aiRow, AI_PIECE);

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
        currentPlayer = (currentPlayer === PLAYER) ? AI_PIECE : PLAYER;
        statusDiv.textContent = `${capitalize(currentPlayer)}'s turn`;
    }
}

// === Board utility functions ===

function getAvailableRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[col][r] === null) return r;
    }
    return null;
}

function getAvailableColumns() {
    const cols = [];
    for (let c = 0; c < COLS; c++) {
        if (board[c][0] === null) cols.push(c);
    }
    return cols;
}

function placePiece(col, row, player) {
    board[col][row] = player;
}

function updateCell(col, row, player) {
    const cells = document.querySelectorAll('.cell');
    const index = row * COLS + col;   
    cells[index].classList.remove('empty');
    cells[index].classList.add(player);
}

function isBoardFull() {
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
            if (board[c][r] === null) return false;
        }
    }
    return true;
}

function checkWin(player) {
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
