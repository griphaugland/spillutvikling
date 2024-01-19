import { calculateGameSize } from './responsive/unitSystem.js';
import { Base, Tower, Enemy, gameObjects } from './base/base.js';
import {
  setScoreboard,
  updateScoreboardCurrency,
  updateScoreboardHealth,
  updateScoreboardKills,
} from './scoreboard/scoreboard.js';
import { getMap } from './maps/map.js';

let units = calculateGameSize();
let state = 'game';
let lastSize;
if (units.multiplier === 1) {
  lastSize = 2;
} else if (units.multiplier === 0.6) {
  lastSize = 1;
} else if (units.multiplier === 1.4) {
  lastSize = 3;
}

const c = document.getElementById('canvas');
const ctx = c.getContext('2d');

let tiles = [];
export let currency;
export let enemies = [];
export let kills = 0;
let towers = [];
export let map = await getMap(1);
export let base = new Base(0, 0, units.boxHeight, units.boxWidth, 1000, 13);

const backgroundImage = new Image();
backgroundImage.src = map.mapimage;

/**
 
Max determines the number of enemies spawned
Delay determines the time between each spawn
Checks if lastEnemy is higher than delay times 60
and checks if maxControl value is higer than max
if enemies array is lower than max and last enemy is higher than delay * 60
it pushes an enemy into the enemies array and resets lastEnemy to 0
if not then lastEnemy gets added one. It does this check 60 times per second (60fps)
@param {number} max
@param {number} delay
*/
let lastEnemy = 0;
let maxControl = 0;
function spawnEnemies(max, delay) {
  if (lastEnemy > 60 * delay && maxControl < max) {
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
        50,
      ),
    );
    maxControl++;
    lastEnemy = 0;
  } else {
    lastEnemy++;
  }
}
/* 
SJEKK TILEN (RETURNERER TRUE / FALSE OM TILEN KAN GÅS PÅ):
SJEKK TILEN UNDER: checkDirection(enemy.posX, enemy.posY +units.boxHeight, true)
SJEKK TILEN OVER: checkDirection(enemy.posX, enemy.posY -units.boxHeight, true)
SJEKK TILEN TIL VENSTRE: checkDirection(enemy.posX -units.boxWidth, enemy.posY, true)
SJEKK TILEN TIL HØYRE: checkDirection(enemy.posX +units.boxWidth, enemy.posY, true)
*/

function checkTileAbove(enemy) {
  if (
    checkDirection(
      enemy.posX,
      enemy.posY - units.boxHeight + units.multiplier,
      true,
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function checkTileBelow(enemy) {
  if (checkDirection(enemy.posX, enemy.posY + units.boxHeight, true)) {
    return true;
  } else {
    return false;
  }
}

function checkTileRight(enemy) {
  if (
    checkDirection(
      enemy.posX + units.boxWidth,
      enemy.posY + units.multiplier,
      true,
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function checkTileLeft(enemy) {
  if (
    checkDirection(
      enemy.posX - units.boxWidth + units.multiplier,
      enemy.posY + units.multiplier,
      true,
    )
  ) {
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
function checkDirection(posX, posY, index) {
  for (let i = 0; i < tiles.length; i++) {
    if (
      posX >= tiles[i].x &&
      posX < tiles[i].x + tiles[i].width &&
      posY >= tiles[i].y &&
      posY < tiles[i].y + tiles[i].height
    ) {
      if (tiles[i].type == 11) {
        return true;
      } else if (tiles[i].type == 13) {
        enemies[index].remove = true;
        base.hp -= enemies[index].dmg;
        updateScoreboardHealth();
        console.log(
          'damaged base with:',
          enemies[index].dmg,
          '. Base now has',
          base.hp,
          'health left',
        );
      } else {
        return false;
      }
    }
  }
  return false;
}

function moveEnemies() {
  for (const i in enemies) {
    switch (enemies[i].direction) {
      case 'right':
        if (
          !checkDirection(
            enemies[i].posX + units.boxWidth,
            enemies[i].posY + units.multiplier,
            i,
          )
        ) {
          changeDirection(enemies[i], enemies[i].direction, i);
        } else {
          enemies[i].posX += units.multiplier;
        }
        break;
      case 'left':
        if (
          !checkDirection(
            enemies[i].posX - units.multiplier,
            enemies[i].posY + units.multiplier,
            i,
          )
        ) {
          changeDirection(enemies[i], enemies[i].direction, i);
        } else {
          enemies[i].posX -= units.multiplier;
        }
        break;
      case 'up':
        if (
          !checkDirection(
            enemies[i].posX + units.multiplier,
            enemies[i].posY,
            i,
          )
        ) {
          changeDirection(enemies[i], enemies[i].direction, i);
        } else {
          enemies[i].posY -= units.multiplier;
        }
        break;
      case 'down':
        if (
          !checkDirection(enemies[i].posX, enemies[i].posY + units.boxHeight, i)
        ) {
          changeDirection(enemies[i], enemies[i].direction, i);
        } else {
          enemies[i].posY += units.multiplier;
        }
        break;
      default:
        break;
    }
  }
}

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
    if (tile.tilebackground) {
      const tileBackground = new Image();
      tileBackground.src = tile.tilebackground;
      ctx.drawImage(tileBackground, tile.x, tile.y, tile.width, tile.height);
    } else {
      ctx.fillStyle = tile.color;
      ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
    }
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
const pauseButton = document.getElementById('pause');
pauseButton.addEventListener('click', () => {
  if (state === 'game') {
    state = 'pause';
  } else if (state === 'pause') {
    state = 'game';
  }
});

function updateUnits() {
  for (let i = 0; i < units.lineLength; i++) {
    for (let k = 0; k < units.lineLength; k++) {
      tiles[i].x = k * units.boxWidth;
      tiles[i].y = i * units.boxHeight;
      tiles[i].width = units.boxWidth;
      tiles[i].height = units.boxHeight;
    }
  }
  for (let enemy of enemies) {
    enemy.posX = enemy.posX * units.multiplier;
    enemy.posY = enemy.posY * units.multiplier;
  }
  c.width = units.maxCanvasWidth;
  c.height = units.maxCanvasHeight;
}

function updateSizes() {
  const units = calculateGameSize();
  let size;
  if (units.multiplier === 1) {
    size = 2;
  } else if (units.multiplier === 0.6) {
    size = 1;
  } else if (units.multiplier === 1.4) {
    size = 3;
  }
  if (size != lastSize) {
    lastSize = size;
    updateUnits();
    state = 'game';
  }
  if (lastSize === 1) {
    size;
  }
}

function loadMap() {
  tiles = [];
  let count = 0;
  for (let i = 0; i < units.lineLength; i++) {
    for (let k = 0; k < units.lineLength; k++) {
      if (map.layout[count] == 0) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'rgba(255, 255, 255, 0.2)',
          type: 0,
        });
      } else if (map.layout[count] == 10) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'lime',
          type: 10,
        });
      } else if (map.layout[count] == 11) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'salmon',
          tilebackground: map.tileimage,
          type: 11,
        });
      } else if (map.layout[count] == 12) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'red',
          type: 12,
        });
      } else if (map.layout[count] == 13) {
        tiles.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'blue',
          tilebackground: map.baseimage,
          type: 13,
        });
      }
      count++;
    }
  }
  c.width = units.maxCanvasWidth;
  c.height = units.maxCanvasHeight;
  currency = 200;
  identifyBaseTile();
}

window.addEventListener('resize', () => {
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
    const posX = units.boxWidth * Math.floor(x / units.boxWidth);
    const posY = units.boxHeight * Math.floor(y / units.boxHeight);
    if (currency >= 100) {
      towers.push(
        new Tower(
          posX,
          posY,
          units.boxWidth,
          units.boxHeight,
          100,
          'tower',
          'lime',
          units.radius,
        ),
      );
      tiles[target.selected].type = 10;
      currency -= 100;
      updateScoreboardCurrency();
    } else {
      notEnoughCurrency(posY, posX);
    }
    gameObjects(towers, enemies);
  }
});

function notEnoughCurrency(posY, posX) {
  tiles.push({
    x: posX,
    y: posY,
    height: units.boxHeight,
    width: units.boxWidth,
    color: 'red',
    type: 0,
  });

  setTimeout(() => {
    tiles.push({
      x: posX,
      y: posY,
      height: units.boxHeight,
      width: units.boxWidth,
      color: 'white',
      type: 0,
    });
  }, 200);
}

function identifyBaseTile() {
  const baseTile = tiles.find((tile) => tile.type === 13);
  base.posX = baseTile.x;
  base.posY = baseTile.y;
  return base;
}

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
let hover;
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  if (hover) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
});
c.addEventListener('mouseenter', (e) => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  hover = true;
});
c.addEventListener('mouseout', () => {
  hover = false;
});
function drawHoverBox(mouseX, mouseY) {
  const x = mouseX;
  const y = mouseY;
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
  const posX = units.boxWidth * Math.floor(x / units.boxWidth);
  const posY = units.boxWidth * Math.floor(y / units.boxWidth);
  if (target.hit && tiles[target.selected].type == 0 && currency >= 100) {
    ctx.fillStyle = 'green';
    ctx.fillRect(posX, posY, units.boxWidth, units.boxHeight);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      posX + units.boxWidth / 2,
      posY + units.boxHeight / 2,
      units.radius,
      0,
      2 * Math.PI,
    );
    ctx.stroke();
  } else {
    ctx.fillStyle = 'red';
    ctx.fillRect(posX, posY, units.boxWidth, units.boxHeight);
  }
}
function checkRadius(enemy, tower) {
  if (
    enemy.posX >= tower.posX - tower.radius &&
    enemy.posX <= tower.posX + tower.width + tower.radius &&
    enemy.posY >= tower.posY - tower.radius &&
    enemy.posY <= tower.posY + tower.height + tower.radius
  ) {
    return true;
  }
  return false;
}
function loopOverTowers() {
  for (const tower of towers) {
    if (tower.lastAttack > tower.attackSpeed) {
      for (const i in enemies) {
        if (checkRadius(enemies[i], tower)) {
          shoot(enemies[i], tower.dmg, i);
          tower.lastAttack = 0;
          /*   
       Shows radius of tower
       ctx.fillRect(
            tower.posX - tower.radius,
            tower.posY - tower.radius,
            tower.radius * 2 + tower.width,
            tower.radius * 2 + tower.height,
          ); */
          break;
        }
      }
    }
    tower.lastAttack++;
  }
}

function shoot(enemy, dmg, i) {
  ctx.fillStyle = 'black';
  ctx.fillRect(enemy.posX, enemy.posY, enemy.width, enemy.height);
  enemy.hp -= dmg;
  if (enemy.hp <= 0) {
    removeEnemy(i);
    currency += enemy.value;
    console.log(currency);
    kills++;
    updateScoreboardCurrency();
    updateScoreboardKills();
  }
}

function removeEnemy(i) {
  console.log('removed enemy', i);
  enemies.splice(i, 1);
}

function checkEnemies() {
  for (let i in enemies) {
    if (enemies[i].remove) {
      removeEnemy(i);
      kills++;
      break;
    }
  }
}

function renderFrame() {
  if (state === 'pause') {
    requestAnimationFrame(renderFrame);
  } else if (state === 'game') {
    checkEnemies();
    ctx.drawImage(backgroundImage, 0, 0, c.width, c.height);
    drawTiles();
    drawGridLayout();
    drawTower();
    moveEnemies();
    drawEnemy();
    gameStatus();
    spawnEnemies(map.enemies, 1);
    if (hover) {
      drawHoverBox(mouseX, mouseY);
    }
    loopOverTowers();
    requestAnimationFrame(renderFrame);
  }
}

loadMap();
renderFrame();

const container = document.querySelector('#container');
container.style.width = `${units.maxCanvasWidth}px`;

setScoreboard();

const game = document.querySelector('.game-over');
const gameOverlay = document.querySelector('.game-overlay');

function gameStatus() {
  if (base.hp == 0) {
    gameOverlay.style.display = 'flex';
    gameOverlay.style.color = 'red';
    game.innerHTML = 'GAME OVER';
    state = 'pause';
  } else if (base.hp > 0 && map.enemies == kills) {
    gameOverlay.style.display = 'flex';
    gameOverlay.style.color = 'green';
    game.innerHTML = 'VICTORY!';
    state = 'pause';
  }
}
