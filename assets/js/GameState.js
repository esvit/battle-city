import { STAGES } from './stages.js';
import { PLAYER_LIVES, TANK_HEAVY, TANK_MEDIUM, TANK_NORMAL, TANK_SWIFT } from './constants.js';

export default
class GameState {
  currentStage = 0;

  tanks = [];

  enemyTankBornTimeout = 5000;

  kills = {};

  killsScore = 0;

  killsCount = 0;

  tankRank = 0;

  maxStageIndex = STAGES.length - 1;

  newGame() {
    this.lives = PLAYER_LIVES;
    this.currentStage = 0;
    this.tankRank = 0;
    this.killsScore = 0;
    gtag('event', 'game_new', {});
  }

  loadStage() {
    this.stage = STAGES[this.currentStage];
    this.tanks = [...this.stage.tanks];
    this.enemyTankBornTimeout = this.stage.enemyTankBornTimeout;
    this.killsCount = 0;
    this.kills = {
      [TANK_NORMAL]: 0,
      [TANK_SWIFT]: 0,
      [TANK_MEDIUM]: 0,
      [TANK_HEAVY]: 0
    };
    gtag('event', 'level_start', {
      'level_name': `${this.currentStage}`
    });
  }
}
