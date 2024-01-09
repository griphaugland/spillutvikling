import { calculateGameSize } from "./responsive/unitSystem.js";
import { Enemy, Tower } from "./base/base.js";



let units = calculateGameSize();
console.log(units);

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let objects = [new Tower(0, 0, 20, 20)];
const testTower = new Tower(800, 800, 20, 20)
console.log(objects)








function renderFrame() {
    for (const object of objects) {
        ctx.beginPath();
        ctx.fillStyle = object.color;
        ctx.fillRect(object.x, object.y, object.width, object.height);
        ctx.stroke();
    }
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
    for (let i = 0; i < objects.length; i++) {
        if (i === 143) {
            objects[i].color = "red"
        }
    }
    ctx.fillStyle = "red"
    ctx.fillRect(testTower.posX, testTower.posY, testTower.width, testTower.height)

}
function updateSizes() {
    objects = [];
    for (let i = 0; i < units.lineLength; i++) {
        for (let k = 0; k < units.lineLength; k++) {
            objects.push({
                x: i * units.boxWidth,
                y: k * units.boxHeight,
                height: units.boxHeight,
                width: units.boxWidth,
                color: "yellow",
            });
        }
    }
    c.width = units.maxCanvasWidth;
    c.height = units.maxCanvasHeight;
    renderFrame();
}

updateSizes();
renderFrame();

window.addEventListener("resize", () => {
    units = calculateGameSize();
    updateSizes();
});

c.addEventListener("click", (e) => {
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
    if (target.hit) {
        console.log("miss");
        const posX = units.boxWidth * Math.floor(x / units.boxWidth);
        const posY = units.boxHeight * Math.floor(y / units.boxHeight);
        ctx.fillStyle = "red";
        ctx.fillRect(posX, posY, units.boxWidth, units.boxHeight);
        ctx.stroke();
    } else {
        console.log("hit", target.selected);
    }
});


;


/* 
const Board = new Canvas();
const testBase = new Base(200, 100, 100, 100, 100);
const testTower = new Tower(100, 50, 50, 50, 100)
const testEnemy = new Enemy(0, 0, 20, 20, 100, 0, "enemy")
const characters = [testBase, testTower, testEnemy];

Board.move() 
Board.draw(characters);
 */




