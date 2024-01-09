import { units } from './responsive/unitSystem.js';
class Base {
  constructor(posX, posY, height, width, hp, type) {
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;
    this.hp = hp;
    this.type = type;
  }
}

export class Enemy extends Base {
  constructor(posX, posY, height, width, hp, type, dmg) {
    super(posX, posY, height, width, hp, type);
    this.dmg = dmg;
    this.boundedMove = this.move.bind(this);
  }

  move() {
    for (let i = 0; i < this.enemy.length; i++) {
      this.enemy[i].posX += 1;
      this.ctx.clearRect(0, 0, units.maxCanvasWidth, units.maxCanvasHeight);
      this.ctx.fillRect(
        this.enemy[i].posX,
        this.enemy[i].posY,
        this.enemy[i].height,
        this.enemy[i].width,
      );
    }
    requestAnimationFrame(() => this.boundedMove());
  }
}

export class Tower {
  constructor(posX, posY, width, height, dmg, type, color) {
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;
    this.dmg = dmg;
    this.type = type;
    this.color = color;
  }
}
