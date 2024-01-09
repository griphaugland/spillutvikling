import { calculateGameSize } from './responsive/unitSystem.js';
import { Tower } from './base/base.js';

let units = calculateGameSize();

const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
let objects = [];
let enemies = [];
let towers = [];
let roundStart = true;

let map = [
  0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 0, 0, 0, 0, 0, 1, 1, 1, 3, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
  0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

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
  for (let i = 0; i < units.lineLength; i++) {
    ctx.beginPath();
    ctx.moveTo(i * units.boxHeight, 0);
    ctx.lineTo(i * units.boxHeight, units.maxCanvasHeight);
    ctx.stroke();
  }

  for (let i = 0; i < units.lineLength; i++) {
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
  console.log(objects);
  if (roundStart) {
    drawEnemy();
  }
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
          valid: i === true,
        });
      } else if (map[count] == 1) {
        objects.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          color: 'red',
          valid: i === false,
        });
      } else if (map[count] == 3) {
        objects.push({
          x: k * units.boxWidth,
          y: i * units.boxHeight,
          height: units.boxHeight,
          width: units.boxWidth,
          type: 'base',
          color: 'blue',
          valid: i === false,
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

function checkValidTile(x, y) {
  const res = objects.filter((item) => {
    item.posX === x && item.posY === y;
  });
  if (res.length) {
    return true;
  } else {
    return false;
  }
}

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

  if (target.hit && checkValidTile(x, y)) {
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
        'enemy1',
        'green',
      ),
    );
    /*       setGameHistory() */
  } else {
    console.log('miss', target.selected);
  }
  renderFrame();
});

/* 
Placing a specific tower
   towers.push(posX, posY, units.boxWidth, units.boxHeight, towerDamage, towerName, type)



towers.push(new Tower(40, 40, units.boxWidth, units.boxHeight, 100, "enemy1",  "green"))
towers.push(new Tower(20, 20, units.boxWidth, units.boxHeight, 100, "enemy2",  "blue"))
towers.push(new Tower(80, 80, units.boxWidth, units.boxHeight, 100, "enemy2",  "orange"))

const Board = new Canvas();
const testBase = new Base(200, 100, 100, 100, 100);
const testTower = new Tower(100, 50, 50, 50, 100)
const testEnemy = new Enemy(0, 0, 20, 20, 100, 0, "enemy")
const characters = [testBase, testTower, testEnemy];

Board.move() 
Board.draw(characters);
 */
