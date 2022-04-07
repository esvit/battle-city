import {
  FILENAME_SPRITES,
  TANKS_SPRITES,
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  IMMORTAL_SPRITE,
  BORN_SPRITE,
  BORN_TIME,
  IMMORTAL_TIME,
  EXPLOSION_TIME,
  EXPLOSION_SPRITE,
  CELL_SIZE,
  SHOOT_COOLDOWN_DEFAULT,
  TANK_PLAYER,
  TANK_SWIFT,
  COLLISION_GROUPS_ENEMY_TANK,
  COLLISION_GROUP_TANK,
  COLLISION_GROUPS_PLAYER_TANK,
  COLLISION_GROUP_PLAYER_TANK,
  COLLISION_GROUP_ENEMY_TANK, TANK_MEDIUM, TANK_HEAVY, DEFAULT_SPEED, SWIFT_SPEED
} from '../constants.js';
import Bullet from './Bullet.js';
import BaseObject from './BaseObject.js';

export default
class Tank extends BaseObject {
  tickSlide = 0;

  player = null; // AI

  constructor({
    x,
    y,
    type,
    direction,
    ResourceManager,
    Sounds,
    map,
    GameState
  }) {
    super({ x, y, width: CELL_SIZE * 2, height: CELL_SIZE * 2, groups: [
      COLLISION_GROUP_TANK,
      type === TANK_PLAYER ? COLLISION_GROUP_PLAYER_TANK : COLLISION_GROUP_ENEMY_TANK
    ] });

    this.type = type;
    this.direction = direction;
    this.moving = false;
    this.resourceManager = ResourceManager;
    this.sounds = Sounds;
    this.map = map;
    this.gameState = GameState;

    this.hits = 1;
    this.speed = DEFAULT_SPEED;
    if (type === TANK_SWIFT) {
      this.speed = SWIFT_SPEED;
    }
    if (type === TANK_MEDIUM) {
      this.hits = 2;
    }
    if (type === TANK_HEAVY) {
      this.hits = 3;
    }

    this.shootCooldown = 0;
    this.bullets = [];
    this.isBorn = false;
    this.isBonus = false;
    this.isBonusSlide = 0;
    this.isBonusSide = 0;
    this.isImmortal = false;
    this.isExplosion = false;
    this.isFreeze = false;
  }

  get isPlayer() {
    return this.type === TANK_PLAYER;
  }

  draw(context, isPause = false) {
    const tick = Math.round(this.tickSlide / 2); // slow animation
    if (this.isBorn) {
      this.drawTankSprite(context, BORN_SPRITE[tick % 4]);
      return;
    }

    if (this.isExplosion) {
      this.drawTankSprite(context, EXPLOSION_SPRITE[Math.round(this.tickSlide / 10) % 3]);
      return;
    }

    this.drawTankSprite(context, this.bounds, true);
    // debug frame
    // const [debugX, debugY, tankWidth, tankHeight] = this.mapBounds;
    // context.drawRect(this.x - 1, this.y - 1, 2, 2, 'lightgreen');
    // context.lines([
    //   { x1: debugX, y1: debugY, x2: debugX, y2: debugY + tankHeight },
    //   { x1: debugX, y1: debugY + tankHeight, x2: debugX + tankWidth, y2: debugY + tankHeight },
    //   { x1: debugX + tankWidth, y1: debugY, x2: debugX + tankWidth, y2: debugY + tankHeight },
    //   { x1: debugX, y1: debugY, x2: debugX + tankWidth, y2: debugY }
    // ], 'green');

    if (this.isImmortal) {
      this.drawTankSprite(context, IMMORTAL_SPRITE[tick % 2]);
    }

    if (this.isPlayer && !this.map.isDefeat && !isPause) {
      if (this.moving) {
        this.sounds.play('move', ['idle']);
      } else {
        this.sounds.play('idle', ['move']);
      }
    }
  }

  drawTankSprite(context, sprite, isTank = false) {
    let [spriteX, spriteY, spriteWidth, spriteHeight] = sprite;

    if (this.isBonus && this.isBonusSide === 1) {
      spriteY += 528;
    }
    if (this.isPlayer && this.gameState.tankRank && isTank) {
      spriteY += spriteHeight * this.gameState.tankRank;
    }
    context.drawSprite(
      this.resourceManager.get(FILENAME_SPRITES),
      spriteX, spriteY, spriteWidth, spriteHeight,
      this.x + (this.width - spriteWidth) / 2, this.y + (this.height - spriteHeight) / 2, // centered
      spriteWidth, spriteHeight
    );
  }

  tick() {
    if (this.shootCooldown > 0) {
      this.shootCooldown -= 20;
      if (this.shootCooldown <= 0) {
        this.shootCooldown = 0;
      }
    }
    this.tickSlide = this.tickSlide + 1;
    this.isBonusSlide = this.isBonusSlide + 1;
    if (this.tickSlide === 100) {
      this.tickSlide = 0;
    }
    if (this.isBonusSlide === 10) {
      this.isBonusSlide = 0;
      this.isBonusSide = this.isBonusSide === 0 ? 1 : 0;
    }
    if (this.gameState.tankRank === 2) { // TANK RANK 2
      this.speed = 6;
    }
    if (this.player && !this.isFreeze) {
      this.player.tick();
    }
  }

  move(direction) {
    if (this.isBorn || this.isExplosion) {
      return;
    }
    this.direction = direction;
    this.moving = true;

    let oldX = this.x;
    let oldY = this.y;
    switch (this.direction) {
      case DIRECTION_UP:
        this.x = Math.round(this.x / CELL_SIZE) * CELL_SIZE;
        this.y -= this.speed;
        break;
      case DIRECTION_DOWN:
        this.x = Math.round(this.x / CELL_SIZE) * CELL_SIZE;
        this.y += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        this.y = Math.round(this.y / CELL_SIZE) * CELL_SIZE;
        break;
      case DIRECTION_RIGHT:
        this.x += this.speed;
        this.y = Math.round(this.y / CELL_SIZE) * CELL_SIZE;
        break;
      default:
        break;
    }

    let objs = this.map.world.getCollisions(this.physicEntity, this.isPlayer ? COLLISION_GROUPS_PLAYER_TANK : COLLISION_GROUPS_ENEMY_TANK);
    const outOfWorld = this.map.world.isOutOfWorld(this.physicEntity);
    if (this.isPlayer) {
      const bonus = objs.find((obj) => obj.ref && obj.ref.isPowerUp);
      objs = objs.filter((obj) => obj.ref && !obj.ref.isPowerUp);
      if (bonus) {
        this.map.catchBonus(bonus.ref, this);
      }
    }
    if (objs.length || outOfWorld) {
      this.x = oldX;
      this.y = oldY;
    }
  }

  get bounds() {
    const tick = Math.round(this.tickSlide / 2); // slow animation
    return TANKS_SPRITES[this.type][this.direction][this.moving ? tick % 2 : 0];
  }

  stop() {
    this.moving = false;
  }

  shoot() {
    if (this.isBorn || this.isExplosion) {
      return;
    }
    if (this.shootCooldown > 0) {
      return;
    }

    const { x: tankX, y: tankY, width: tankWidth, height: tankHeight } = this.physicEntity;
    let x = tankX + CELL_SIZE / 2;
    let y = tankY + CELL_SIZE / 2;
    if (this.direction === DIRECTION_DOWN) {
      y += tankHeight;
    }
    if (this.direction === DIRECTION_RIGHT) {
      x += tankWidth;
    }
    if (this.direction === DIRECTION_UP || this.direction === DIRECTION_DOWN) {
      y -= CELL_SIZE;
    }
    if (this.direction === DIRECTION_LEFT || this.direction === DIRECTION_RIGHT) {
      x -= CELL_SIZE;
    }
    this.bullets = this.bullets.filter((bullet) => bullet.isActive);

    const maxBulletCount = this.gameState.tankRank > 0 ? 2 : 1;  // TANK RANK 1
    if (this.bullets.length < maxBulletCount) {
      const bullet = new Bullet({
        x: x,
        y: y,
        direction: this.direction,
        ResourceManager: this.resourceManager,
        Sounds: this.sounds,
        map: this.map,
        damage: 1,
        tank: this
      });
      this.bullets.push(bullet);
      this.map.gameObjects.push(bullet);
      this.map.world.addObject(bullet.physicEntity);
      if (this.isPlayer) {
        this.sounds.play('shoot');
      }
    }
    this.shootCooldown = SHOOT_COOLDOWN_DEFAULT;
  }

  born(isImmortal = true) {
    this.isBorn = true;
    this.isExplosion = false;
    if (this.isPlayer) {
      this.hits = 1;
      this.speed = DEFAULT_SPEED;
    }
    setTimeout(() => this.isBorn = false, BORN_TIME);

    if (isImmortal) {
      this.isImmortal = isImmortal;
      setTimeout(() => this.isImmortal = false, IMMORTAL_TIME);
    }
  }

  async hit() {
    if (this.isBorn || this.isImmortal || this.isExplosion) {
      return;
    }
    if (this.isPlayer) {
      this.hits--;
      if (this.hits === 0) {
        await this.explode();
        this.gameState.lives -= 1;
        if (this.gameState.lives === 0) {
          // game over
          this.map.defeat();
        } else {
          this.gameState.tankRank = 0;
          this.map.putPlayer1(this);
          this.born();
        }
      } else {
        this.gameState.tankRank--;
      }
    } else {
      if (this.isBonus) {
        this.isBonus = false;
        this.map.createBonus();
      }
      this.hits--;
      if (this.hits === 0) {
        this.gameState.kills[this.type] += 1;
        this.gameState.killsScore += this.type * 100;
        this.gameState.killsCount += 1;
        await this.explode();
      } else {
        this.sounds.play('hit');
      }
    }
  }

  async explode() {
    this.sounds.play('explosion', ['shoot', 'move', 'idle']);

    return new Promise((resolve) => {
      this.isExplosion = true;
      setTimeout(() => {
        this.isExplosion = false;
        this.isBorn = false;
        this.map.removeObject(this);
        resolve();
      }, EXPLOSION_TIME);
    });
  }
}
