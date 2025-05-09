import FastPriorityQueue from "fastpriorityqueue"; // npm install fastpriorityqueue

function heuristic(boxes, goals) {
  return boxes.reduce((acc, box) => {
    const dists = goals.map(g => Math.abs(box.x - g.x) + Math.abs(box.y - g.y));
    return acc + Math.min(...dists);
  }, 0);
}

function stateKey(player, boxes) {
  const boxStr = boxes.map(b => `${b.x},${b.y}`).sort().join(";");
  return `P=${player.x},${player.y}|B=${boxStr}`;
}

function cloneBoxes(boxes) {
  return boxes.map(b => ({ x: b.x, y: b.y }));
}

export function solveSokoban(level) {
  const open = new FastPriorityQueue((a, b) => a.priority < b.priority);
  const visited = new Set();

  const initState = {
    player: { ...level.player },
    boxes: cloneBoxes(level.boxes),
    path: []
  };

  const goals = level.goals;

  open.add({
    state: initState,
    cost: 0,
    priority: heuristic(initState.boxes, goals)
  });

  while (!open.isEmpty()) {
    const current = open.poll();
    const { player, boxes, path } = current.state;
    const key = stateKey(player, boxes);

    if (visited.has(key)) continue;
    visited.add(key);

    // Check if solved
    const isSolved = boxes.every(box => goals.some(goal => box.x === goal.x && box.y === goal.y));
    if (isSolved) {
      return path.concat({ player, boxes });
    }

    // Explore moves
    for (const [dx, dy] of [[0,1],[1,0],[-1,0],[0,-1]]) {
      const newPlayer = { x: player.x + dx, y: player.y + dy };
      const boxIdx = boxes.findIndex(b => b.x === newPlayer.x && b.y === newPlayer.y);

      if (level.map[newPlayer.y][newPlayer.x] === "#") continue; // wall

      let newBoxes = cloneBoxes(boxes);
      if (boxIdx !== -1) {
        // Attempting to push a box
        const beyond = { x: newPlayer.x + dx, y: newPlayer.y + dy };
        if (
          level.map[beyond.y][beyond.x] === "#" ||
          boxes.some(b => b.x === beyond.x && b.y === beyond.y)
        ) continue; // blocked

        // Push box
        newBoxes[boxIdx] = beyond;
      }

      const newState = { player: newPlayer, boxes: newBoxes, path: path.concat({ player, boxes }) };
      const newKey = stateKey(newPlayer, newBoxes);
      if (!visited.has(newKey)) {
        open.add({
          state: newState,
          cost: path.length + 1,
          priority: path.length + 1 + heuristic(newBoxes, goals)
        });
      }
    }
  }

  // No solution found
  return [];
}
