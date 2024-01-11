import { calculateGameSize } from './responsive/unitSystem.js';
import { Tower, Enemy } from './base/base.js';

let units = calculateGameSize();

const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
let tiles = [];
let enemies = [];
let towers = [];
let roundStart = true;

// prettier-ignore
let map = [
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 3, 
    0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 6, 6, 0, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 6, 6, 0, 1, 1, 0, 0, 
    0, 0, 1, 0, 0, 6, 6, 0, 0, 1, 0, 0, 
    0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 
    0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 
    0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0,
];
let lastEnemy = 0;

function spawnEnemies(max, delay) {
  if (enemies.length < max && lastEnemy > 60 * delay) {
    enemies.push(
      new Enemy(
        units.boxWidth * 2,
        units.boxWidth * 0,
        units.boxWidth,
        units.boxHeight,
        200,
        5,
        100,
        'red',
        'down',
      ),
    );
    lastEnemy = 0;
  } else {
    lastEnemy++;
  }
}

/* 
SJEKK TILEN (RETURNERER TRUE / FALSE OM TILEN KAN GÅS PÅ):
SJEKK TILEN UNDER: checkDirection(enemy.posX, enemy.posY + units.boxHeight, true)
SJEKK TILEN OVER: checkDirection(enemy.posX, enemy.posY - units.boxHeight, true)
SJEKK TILEN TIL VENSTRE: checkDirection(enemy.posX - units.boxWidth, enemy.posY, true)
SJEKK TILEN TIL HØYRE: checkDirection(enemy.posX + units.boxWidth, enemy.posY, true)
*/
function checkTileAbove(enemy) {
  if (checkDirection(enemy.posX, enemy.posY - units.boxHeight + 1, true)) {
    return true;
  } else {
    return false;
  }
}
function checkTileBelow(enemy) {
  console.log(enemy.direction);
  if (checkDirection(enemy.posX, enemy.posY + units.boxHeight, true)) {
    return true;
  } else {
    return false;
  }
}
function checkTileRight(enemy) {
  if (checkDirection(enemy.posX + units.boxWidth, enemy.posY + 1, true)) {
    return true;
  } else {
    return false;
  }
}
function checkTileLeft(enemy) {
  if (checkDirection(enemy.posX - units.boxWidth + 1, enemy.posY + 1, true)) {
    return true;
  } else {
    return false;
  }
}

function checkSurroundingTiles(enemy) {
  // Check each direction in a prioritized order
  if (enemy.direction !== 'down' && checkTileAbove(enemy)) {
    return { up: true, down: false, left: false, right: false };
  }
  if (enemy.direction !== 'right' && checkTileLeft(enemy)) {
    return { up: false, down: false, left: true, right: false };
  }
  if (enemy.direction !== 'up' && checkTileBelow(enemy)) {
    return { up: false, down: true, left: false, right: false };
  }
  if (enemy.direction !== 'left' && checkTileRight(enemy)) {
    return { up: false, down: false, left: false, right: true };
  }
  // If none of the directions are available, return all false
  return { up: false, down: false, left: false, right: false };
}

function changeDirection(enemy) {
  const enemyDirectionsObj = checkSurroundingTiles(enemy);
  console.log(enemyDirectionsObj);
  if (enemyDirectionsObj.down) {
    enemy.direction = 'down';
  } else if (enemyDirectionsObj.up) {
    enemy.direction = 'up';
  } else if (enemyDirectionsObj.left) {
    enemy.direction = 'left';
  } else if (enemyDirectionsObj.right) {
    enemy.direction = 'right';
  }
}

// Returnerer true hvis enemy kan bevege seg dit
function checkDirection(posX, posY) {
  for (let i = 0; i < tiles.length; i++) {
    if (
      posX >= tiles[i].x &&
      posX < tiles[i].x + tiles[i].width &&
      posY >= tiles[i].y &&
      posY < tiles[i].y + tiles[i].height
    ) {
      if (tiles[i].type !== 1) {
        return false;
      } /* else if (tiles[i].type === 3) {
        console.log('HEALTH LOSS');
        enemies.pop();
        window.alert('YOu took damage');
      } */ else {
        return true;
      }
    }
  }
  return false;
}

function moveEnemies() {
  for (const enemy of enemies) {
    switch (enemy.direction) {
      case 'right':
        if (!checkDirection(enemy.posX + units.boxWidth, enemy.posY + 1)) {
          console.log('hit right');
          changeDirection(enemy, enemy.direction);
        } else {
          enemy.posX++;
        }
        break;
      case 'left':
        if (!checkDirection(enemy.posX - 1, enemy.posY + 1)) {
          console.log('hit left');
          changeDirection(enemy, enemy.direction);
        } else {
          enemy.posX--;
        }
        break;
      case 'up':
        if (!checkDirection(enemy.posX + 1, enemy.posY)) {
          console.log('hit up');
          changeDirection(enemy, enemy.direction);
        } else {
          enemy.posY--;
        }
        break;
      case 'down':
        if (!checkDirection(enemy.posX, enemy.posY + units.boxHeight)) {
          console.log('hit down');
          changeDirection(enemy, enemy.direction);
        } else {
          enemy.posY++;
        }
        break;
      default:
        break;
    }
  }
}

// Regular tile = 0
// Enemy Path = 1
// Home base = 3
// Towers = 4

function drawEnemy() {
  for (const enemy of enemies) {
    ctx.beginPath();
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.posX, enemy.posY, units.boxWidth, units.boxHeight);
    ctx.stroke();
  }
}

function drawTower() {
  for (const tower of towers) {
    ctx.beginPath();
    ctx.fillStyle = tower.color;
    ctx.fillRect(tower.posX, tower.posY, tower.width, tower.height);
    ctx.stroke();
  }
}

function drawTiles() {
  for (const tile of tiles) {
    ctx.beginPath();
    ctx.fillStyle = tile.color;
    ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
    ctx.stroke();
  }
}

function drawGridLayout() {
  for (let i = 0; i <= units.lineLength; i++) {
    ctx.beginPath();
    ctx.moveTo(i * units.boxHeight, 0);
    ctx.lineTo(i * units.boxHeight, units.maxCanvasHeight);
    ctx.stroke();
  }
  for (let i = 0; i <= units.lineLength; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * units.boxWidth);
    ctx.lineTo(units.maxCanvasWidth, i * units.boxWidth);
    ctx.stroke();
  }
}

function renderFrame() {
  drawTiles();
  drawGridLayout();
  drawTower();
  moveEnemies();
  if (roundStart) {
    drawEnemy();
    spawnEnemies(10, spawnEnemies(10, 10));
  }
  requestAnimationFrame(renderFrame);
}
function updateSizes() {
  tiles = [];
  let count = 0;
  for (let i = 0; i < units.lineLength; i++) {
    for (let k = 0; k < units.lineLength; k++) {
      if (map[count] == 0) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'white',
          type: 0,
        });
      } else if (map[count] == 1) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'lightgreen',
          type: 1,
        });
      } else if (map[count] == 3) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'blue',
          type: 3,
        });
      } else if (map[count] == 6) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'orange',
          type: 3,
        });
      }
      count++;
    }
  }
  c.width = units.maxCanvasWidth;
  c.height = units.maxCanvasHeight;
  renderFrame();
}
updateSizes();
renderFrame();

window.addEventListener('resize', () => {
  units = calculateGameSize();
  updateSizes();
});

c.addEventListener('click', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  let target = {
    hit: false,
    selected: 0,
  };
  for (let i = 0; i < tiles.length; i++) {
    if (
      x >= tiles[i].x &&
      x <= tiles[i].x + tiles[i].width &&
      y > tiles[i].y &&
      y < tiles[i].y + tiles[i].height
    ) {
      target.hit = true;
      target.selected = i;
      break;
    }
  }
  if (target.hit && tiles[target.selected].type == 0) {
    console.log('hit, placed tower on tile', target.selected);
    const posX = units.boxWidth * Math.floor(x / units.boxWidth);
    const posY = units.boxHeight * Math.floor(y / units.boxHeight);
    towers.push(
      new Tower(
        posX,
        posY,
        units.boxWidth,
        units.boxHeight,
        100,
        'tower',
        'green',
      ),
    );

    tiles[target.selected].type = 4;
  } else {
    console.log('miss', target.selected);
  }
});

/* 

const Board = new Canvas();
const testBase = new Base(200, 100, 100, 100, 100);
const testTower = new Tower(100, 50, 50, 50, 100)
const testEnemy = new Enemy(0, 0, 20, 20, 100, 0, "enemy")
const characters = [testBase, testTower, testEnemy];

Board.move() 
Board.draw(characters);
 */

/* checkGameHistory()

function checkGameHistory(){
    if(localStorage.getItem("previousGameHistory")){
        let previousGame =  JSON.parse(localStorage.getItem("previousGameHistory"))
        enemies = previousGame.enemies
        towers = previousGame.towers
        console.log('found previous game, started with data from previous game')
    } else {
        console.log('no game history in localstorage, starting new game')
    }
}
function setGameHistory(){
    let currentGame = {
        enemies,
        towers,
    }
    localStorage.setItem('previousGameHistory', JSON.stringify(currentGame))
} */
