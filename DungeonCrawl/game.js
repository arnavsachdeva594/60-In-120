// Game variables
let dungeon = [];
let currentLevel = 0;
let dungeonSize = 10;
let player = { hp: 100, attack: 10, defense: 5, mana: 30, level: 1, x: 0, y: 0 }; // Added player position
let monster = { hp: 50, attack: 8, defense: 3, x: 4, y: 4 };

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

// Render the dungeon grid with icons
function renderDungeon() {
  const gridElement = document.getElementById('dungeon-grid');
  gridElement.innerHTML = '';
  let level = dungeon[currentLevel];

  for (let i = 0; i < dungeonSize; i++) {
    for (let j = 0; j < dungeonSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      let tile = level[i][j];

      // Add appropriate image based on the tile type
      let img = document.createElement('img');
      if (tile === 'wall') {
        img.src = 'images/wall.png';
      } else if (tile === 'monster') {
        img.src = 'images/monster.png';
      } else if (tile === 'loot') {
        img.src = 'images/loot.png';
      } else if (tile === 'empty') {
        img.src = 'images/empty.png';
      } else if (tile === 'exit') {
        img.src = 'images/exit.png';
      }

      cell.appendChild(img);
      gridElement.appendChild(cell);
    }
  }

  // Update player and monster positions
  updateEntityPosition(player, 'player');
  updateEntityPosition(monster, 'monster');
}

// Update entity positions
function updateEntityPosition(entity, type) {
  const gridElement = document.getElementById('dungeon-grid');
  const cells = gridElement.getElementsByClassName('cell');
  const index = entity.y * dungeonSize + entity.x;
  cells[index].classList.add(type);
}

// Attack function
function attack() {
  let damage = player.attack - monster.defense;
  monster.hp -= Math.max(damage, 0);
  logCombat(`You attacked the monster for ${Math.max(damage, 0)} damage.`);

  if (monster.hp <= 0) {
    logCombat("You defeated the monster!");
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
  player.x = (player.x + 1) % dungeonSize; // Basic movement to next cell
  renderDungeon();
});

document.getElementById('attack-button').addEventListener('click', () => {
  attack();
  document.getElementById('combat-sound').play();  // Play combat sound
});
