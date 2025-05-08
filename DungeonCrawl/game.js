// Game variables
let dungeon = [];
let currentLevel = 0;
let dungeonSize = 10;
let player = { hp: 100, attack: 10, defense: 5, mana: 30, level: 1 };
let monster = { hp: 50, attack: 8, defense: 3 };

// Initialize dungeon and render
generateDungeon(0);
renderDungeon();

// Dungeon generation (simple version)
function generateDungeon(level) {
  let levelGrid = [];
  for (let i = 0; i < dungeonSize; i++) {
    let row = [];
    for (let j = 0; j < dungeonSize; j++) {
      let tile = Math.random();
      if (tile < 0.2) row.push('wall');
      else if (tile < 0.4) row.push('monster');
      else if (tile < 0.6) row.push('loot');
      else if (tile < 0.8) row.push('empty');
      else row.push('exit');
    }
    levelGrid.push(row);
  }
  dungeon.push(levelGrid);
}

// Render the dungeon grid
function renderDungeon() {
  const gridElement = document.getElementById('dungeon-grid');
  gridElement.innerHTML = '';
  let level = dungeon[currentLevel];
  for (let i = 0; i < dungeonSize; i++) {
    for (let j = 0; j < dungeonSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      let tile = level[i][j];
      cell.classList.add(tile);
      gridElement.appendChild(cell);
    }
  }
}

// Attack function
function attack() {
  let damage = player.attack - monster.defense;
  monster.hp -= Math.max(damage, 0);
  logCombat(`You attacked the monster for ${Math.max(damage, 0)} damage.`);

  if (monster.hp <= 0) {
    logCombat("You defeated the monster!");
    // Spawn loot and move to the next level or room
    monster.hp = 50; // Reset monster health for the next round
  } else {
    monsterTurn();
  }

  updateStatus();
}

// Monster turn function
function monsterTurn() {
  let damage = monster.attack - player.defense;
  player.hp -= Math.max(damage, 0);
  logCombat(`The monster attacked you for ${Math.max(damage, 0)} damage.`);
  
  if (player.hp <= 0) {
    logCombat("You were defeated!");
  }
  
  updateStatus();
}

// Logging combat actions
function logCombat(message) {
  const log = document.getElementById('combat-log');
  log.innerHTML += `<p>${message}</p>`;
}

// Update player status display
function updateStatus() {
  document.getElementById('player-hp').innerText = player.hp;
  document.getElementById('player-level').innerText = player.level;
  document.getElementById('player-mana').innerText = player.mana;
}

// Button listeners for game actions
document.getElementById('move-button').addEventListener('click', () => {
  // Move through dungeon (dummy function for now)
  logCombat("You move through the dungeon...");
});

document.getElementById('attack-button').addEventListener('click', () => {
  attack();
});
