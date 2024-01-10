import { calculateGameSize } from './responsive/unitSystem.js';
import { Tower, Enemy } from './base/base.js';

let units = calculateGameSize();

const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
let objects = [];
let enemies = [];
let towers = [];
let roundStart = true;

// prettier-ignore
let map = [
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 3, 
    0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

enemies.push(
  new Enemy(
    100,
    0,
    units.boxWidth,
    units.boxHeight,
    200,
    5,
    100,
    'red',
    'down',
  ),
);
console.log(enemies);

function changeDirection(enemy) {
  console.log(enemy.direction);
  if (enemy.direction === 'up') {
    //check right box
    if (checkDirection(enemy.posX + units.boxWidth + 1, enemy.posY, true)) {
      enemy.direction = 'right';
      console.log('changing to right direction');
    } else {
      enemy.direction = 'left';
      console.log('changing to left direction');
    }
  } else if (enemy.direction === 'down') {
    //check right box
    if (checkDirection(enemy.posX + units.boxWidth + 1, enemy.posY, true)) {
      enemy.direction = 'right';
      console.log('changing to right direction');
    } else {
      enemy.direction = 'left';
      console.log('changing to left direction');
    }
  } else if (enemy.direction === 'left') {
    //check down box
    if (checkDirection(enemy.posX, enemy.posY + units.boxHeight + 1, true)) {
      enemy.direction = 'down';
      console.log('changing to down direction');
      console.log(enemy.posX, enemy.posY);
      window.cancelAnimationFrame();
    } else {
      enemy.direction = 'up';
      console.log('changing to up direction');
    }
  } else if (enemy.direction === 'right') {
    //check down box
    if (checkDirection(enemy.posX, enemy.posY + units.boxHeight + 1, true)) {
      enemy.direction = 'down';
      console.log('changing to down direction');
    } else {
      enemy.direction = 'up';
      console.log('changing to up direction');
    }
  }
}

/* function changeDirection(enemy) {
    console.log(enemy.direction);
    if (enemy.direction === 'up' || enemy.direction === 'down') {
      //check right box
      if (checkDirection(enemy.posX + units.boxWidth + 1, enemy.posY, true)) {
        enemy.direction = 'right';
        enemy.posX++;
      } else {
        enemy.direction = 'left';
        enemy.posX--;
      }
    }  else if (enemy.direction === 'left' || enemy.direction === 'right') {
      //check down box
      if (checkDirection(enemy.posX, enemy.posY + units.boxHeight + 1, true)) {
        enemy.direction = 'down';
        enemy.posY++;
      } else {
        enemy.direction = 'up';
        enemy.posY--;
      }
    }
  } */
// Returnerer true hvis enemy kan bevege seg dit
function checkDirection(posX, posY, log) {
  for (let i = 0; i < objects.length; i++) {
    if (
      posX >= objects[i].x &&
      posX < objects[i].x + objects[i].width &&
      posY >= objects[i].y &&
      posY < objects[i].y + objects[i].height
    ) {
      if (log) {
        console.log(posX, posY, objects[i].x, objects[i].y);
      }
      if (objects[i].type !== 1) {
        return false;
      } else {
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
        if (!checkDirection(enemy.posX + units.boxWidth, enemy.posY)) {
          console.log('hit');
          changeDirection(enemy);
        } else {
          enemy.posX++;
        }
        break;
      case 'left':
        if (!checkDirection(enemy.posX, enemy.posY)) {
          console.log('hit');
          changeDirection(enemy);
        } else {
          enemy.posX--;
        }
        break;
      case 'up':
        if (!checkDirection(enemy.posX, enemy.posY)) {
          console.log('hit');
          changeDirection(enemy);
        } else {
          enemy.posY--;
        }
        break;
      case 'down':
        if (!checkDirection(enemy.posX, enemy.posY + units.boxHeight)) {
          console.log('hit');
          changeDirection(enemy);
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
    ctx.fillRect(enemy.posX, enemy.posY, enemy.width, enemy.height);
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
  for (const object of objects) {
    ctx.beginPath();
    ctx.fillStyle = object.color;
    ctx.fillRect(object.x, object.y, object.width, object.height);
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
  }
  requestAnimationFrame(renderFrame);
}
function updateSizes() {
  objects = [];
  let count = 0;
  for (let i = 0; i < units.lineLength; i++) {
    for (let k = 0; k < units.lineLength; k++) {
      if (map[count] == 0) {
        objects.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'white',
          type: 0,
        });
      } else if (map[count] == 1) {
        objects.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'lightgreen',
          type: 1,
        });
      } else if (map[count] == 3) {
        objects.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'blue',
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
  for (let i = 0; i < objects.length; i++) {
    if (
      x >= objects[i].x &&
      x <= objects[i].x + objects[i].width &&
      y > objects[i].y &&
      y < objects[i].y + objects[i].height
    ) {
      target.hit = true;
      target.selected = i;
      break;
    }
  }
  if (target.hit && objects[target.selected].type == 0) {
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

    objects[target.selected].type = 4;
  } else {
    console.log('miss', target.selected);
  }
  renderFrame();
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
