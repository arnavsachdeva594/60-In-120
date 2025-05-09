// Function to generate a random solvable Sokoban level
function generateLevel(width = 8, height = 8, numBoxes = 2) {
    const map = Array.from({ length: height }, () => Array(width).fill(' '));

    // Boundary walls
    for (let x = 0; x < width; x++) {
        map[0][x] = '#';
        map[height - 1][x] = '#';
    }
    for (let y = 0; y < height; y++) {
        map[y][0] = '#';
        map[y][width - 1] = '#';
    }

    const randPos = () => ({
        x: Math.floor(Math.random() * (width - 2)) + 1,
        y: Math.floor(Math.random() * (height - 2)) + 1
    });

    // Generate a solvable level with random player, boxes, and goals
    const solvedState = generateSolvedState(width, height, numBoxes, randPos);
    const { player, boxes, goals } = solvedState;

    const levelMap = mapLevel(map, player, boxes, goals);

    return {
        map: levelMap.map(row => row.join('')),
        player,
        boxes,
        goals
    };
}

function generateSolvedState(width, height, numBoxes, randPos) {
    const player = randPos();
    const boxes = [];
    const goals = [];

    for (let i = 0; i < numBoxes; i++) {
        let boxPos, goalPos;
        do {
            boxPos = randPos();
        } while (boxes.some(b => b.x === boxPos.x && b.y === boxPos.y));
        boxes.push(boxPos);

        do {
            goalPos = randPos();
        } while (goals.some(g => g.x === goalPos.x && g.y === goalPos.y) || boxes.some(b => b.x === goalPos.x && b.y === goalPos.y));
        goals.push(goalPos);
    }

    return { player, boxes, goals };
}

function mapLevel(map, player, boxes, goals) {
    map[player.y][player.x] = '@';

    boxes.forEach(box => {
        map[box.y][box.x] = '$';
    });

    goals.forEach(goal => {
        map[goal.y][goal.x] = '.';
    });

    return map;
}
