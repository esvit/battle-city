import BaseObject from './BaseObject.js';
import {
  BULLET_SPRITE,
  CELL_SIZE,
  COLLISION_GROUP_PLAYER_BULLET,
  COLLISION_GROUP_ENEMY_BULLET,
  COLLISION_GROUPS_ENEMY_BULLET,
  COLLISION_GROUPS_PLAYER_BULLET,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  EXPLOSION_SPRITE,
  EXPLOSION_TIME,
  FILENAME_SPRITES,
  MAP_OBJECT_BRICK, MAP_OBJECT_STEEL
} from '../constants.js';

const SPEED_DIV = 4;

export default
class Bullet extends BaseObject {
  tickSlide = 0;

  constructor({
                x,
                y,
                direction,
                ResourceManager,
                Sounds,
                tank,
                map,
                damage
              }) {
    super({
      x: x - 3,
      y: y - 3,
      width: CELL_SIZE + 6,
      height: CELL_SIZE + 6,
      groups: tank.isPlayer ? [COLLISION_GROUP_PLAYER_BULLET] : [COLLISION_GROUP_ENEMY_BULLET] });

    this.direction = direction;
    this.damage = damage;
    this.resourceManager = ResourceManager;
    this.sounds = Sounds;
    this.tank = tank;
    this.map = map;
    this.speed = CELL_SIZE / SPEED_DIV;
    this.isExplosion = false;
    this.isActive = true;
  }

  draw(context) {
    if (this.map.isDebug) {
      return;
    }
    const [spriteX, spriteY, spriteWidth, spriteHeight] = BULLET_SPRITE[this.direction];
    context.drawSprite(
      this.resourceManager.get(FILENAME_SPRITES),
      spriteX, spriteY, spriteWidth, spriteHeight,
      this.physicEntity.midX - (spriteWidth / 2), this.physicEntity.midY - (spriteHeight / 2), // centered
      spriteWidth, spriteHeight
    );

    if (this.isExplosion) {
      const [spriteX, spriteY, spriteWidth, spriteHeight] = EXPLOSION_SPRITE[Math.round(this.tickSlide / 10) % 3];
      context.drawSprite(
        this.resourceManager.get(FILENAME_SPRITES),
        spriteX, spriteY, spriteWidth, spriteHeight,
        this.physicEntity.midX - (spriteWidth / 2), this.physicEntity.midY - (spriteHeight / 2), // centered
        spriteWidth, spriteHeight
      );
    }
  }

  tick() {
    this.tickSlide = this.tickSlide + 1;
    if (this.tickSlide === 100) {
      this.tickSlide = 0;
    }
    if (this.isExplosion) {
      return;
    }

    let deltaX = 0;
    let deltaY = 0;
    switch (this.direction) {
      case DIRECTION_UP:
        deltaY = -this.speed;
        break;
      case DIRECTION_DOWN:
        deltaY = this.speed;
        break;
      case DIRECTION_LEFT:
        deltaX = -this.speed;
        break;
      case DIRECTION_RIGHT:
        deltaX = this.speed;
        break;
      default:
        break;
    }

    const objs = this.map.world.getCollisions(this.physicEntity, this.tank.isPlayer ? COLLISION_GROUPS_PLAYER_BULLET : COLLISION_GROUPS_ENEMY_BULLET);
    if (this.map.world.isOutOfWorld(this.physicEntity)) { // за межі карти
      this.isActive = false;
      this.map.removeObject(this);
    }
    if (objs.length) {
      for (const obj of objs) {
        if (obj.ref && obj.ref.isBase && !this.map.isWin) {
          this.map.defeat();
        }
        if (obj.ref && obj.ref.block === MAP_OBJECT_BRICK) {
          this.map.clear(obj.ref.cell, obj.ref.row);
        }
        if (this.tank.isPlayer && this.tank.gameState.tankRank === 3 && obj.ref && obj.ref.block === MAP_OBJECT_STEEL) {  // TANK RANK 3
          this.map.clear(obj.ref.cell, obj.ref.row);
        }
        if (obj.ref.constructor.name === 'Tank') {
          obj.ref.hit();
          this.isActive = false;
          this.map.removeObject(this);
          break; // тільки 1 танк за раз
        }
        if (obj.ref.constructor.name !== 'Bullet') {
          this.explode();
        } else {
          this.isActive = false;
          obj.ref.isActive = false;
          this.map.removeObject(this);
          this.map.removeObject(obj.ref);
          break;
        }
      }
      this.map.redrawMap();
      if (!this.map.isWin && this.tank.isPlayer) {
        this.map.checkWinState();
      }
      return;
    }
    this.x += deltaX;
    this.y += deltaY;
  }

  async explode() {
    if (this.tank.isPlayer) {
      this.sounds.play('wall', ['wall']);
    }
    return new Promise((resolve) => {
      this.isExplosion = true;
      setTimeout(() => {
        this.isActive = false;
        this.map.removeObject(this);
        resolve();
      }, EXPLOSION_TIME / 2);
    });
  }
}
