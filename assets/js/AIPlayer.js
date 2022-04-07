import {
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
} from './constants.js';

const MOVE_UP = 1;
const MOVE_DOWN = 2;
const MOVE_LEFT = 3;
const MOVE_RIGHT = 4;
const MOVE_SHOOT = 5;
const MOVE_TURN_LEFT = 6;
const MOVE_TURN_RIGHT = 7;
const MOVE_DO_NOTHING = 8;

const ACTIONS = [
  MOVE_UP,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_SHOOT,
  MOVE_TURN_LEFT,
  MOVE_TURN_RIGHT,
  MOVE_DO_NOTHING
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default
class AIPlayer {
  actionList = [MOVE_DOWN, MOVE_SHOOT, MOVE_SHOOT, MOVE_SHOOT, MOVE_SHOOT, MOVE_DOWN, MOVE_DOWN];

  tickSlide = 0;

  constructor({ tank, map }) {
    this.tank = tank;
    this.map = map;
  }

  tick() {
    this.tickSlide = this.tickSlide + 1;
    if (this.tickSlide === 100) {
      this.tickSlide = 0;
    }
    if (this.tickSlide % 10 === 0) {
      this.actionList.pop();
      return;
    }
    const action = this.actionList[0];
    if (!action) {
      const random = Math.random();
      if (random < 0.4) {
        this.actionList.push(randomItem(ACTIONS));
        this.actionList.concat([
          MOVE_SHOOT,
          MOVE_SHOOT,
          MOVE_SHOOT,
          MOVE_SHOOT,
          MOVE_DO_NOTHING,
          MOVE_DO_NOTHING,
          MOVE_DO_NOTHING,
          MOVE_SHOOT
        ]);
      } else if (random < 0.7) {
        // if (Math.floor(random * 100) % 2 === 0) {
        //   if (agent.coordinate.x < target.coordinate.x) {
        //     this.actionList.push(MOVE_RIGHT);
        //   } else {
        //     this.actionList.push(MOVE_LEFT);
        //   }
        // } else {
        //   if (agent.coordinate.y < target.coordinate.y) {
        //     this.actionList.push(MOVE_DOWN);
        //   } else {
        //     this.actionList.push(MOVE_UP);
        //   }
        // }
        this.actionList.concat([MOVE_SHOOT, MOVE_SHOOT]);
      } else if (random < 0.75) {
        this.actionList.concat([
          MOVE_UP,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
        ]);
      } else if (random < 0.8) {
        this.actionList.concat([
          MOVE_LEFT,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
        ]);
      } else if (random < 0.85) {
        this.actionList.concat([
          MOVE_RIGHT,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
        ]);
      } else if (random < 0.9) {
        this.actionList.concat([
          MOVE_DOWN,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
          MOVE_DO_NOTHING,
          MOVE_SHOOT,
        ]);
      } else {
        this.actionList.push(MOVE_SHOOT);
      }
      return;
    }

    switch (action) {
    case MOVE_DO_NOTHING: break;
    case MOVE_UP:
      this.tank.move(DIRECTION_UP)
      break;
    case MOVE_DOWN:
      this.tank.move(DIRECTION_DOWN)
      break;
    case MOVE_LEFT:
      this.tank.move(DIRECTION_LEFT)
      break;
    case MOVE_RIGHT:
      this.tank.move(DIRECTION_RIGHT)
      break;
    case MOVE_TURN_LEFT:
      this.tank.direction += 2;
      this.tank.direction %= 4;
      break;
    case MOVE_TURN_RIGHT:
      switch (this.tank.direction) {
        case DIRECTION_DOWN: this.tank.move(DIRECTION_LEFT); break;
        case DIRECTION_UP: this.tank.move(DIRECTION_RIGHT); break;
        case DIRECTION_LEFT: this.tank.move(DIRECTION_UP); break;
        case DIRECTION_RIGHT: this.tank.move(DIRECTION_DOWN); break;
      }
      break;
    case MOVE_SHOOT:
      this.tank.shoot();
      this.actionList.pop();
      break;
    }
  }
}
