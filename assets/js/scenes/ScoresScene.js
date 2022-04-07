import Scene from '../Scene.js';
import {
  DELAY_BEFORE_NEXT_LEVEL_SCORES,
  DIRECTION_UP,
  FILENAME_SPRITES, TANK_HEAVY, TANK_MEDIUM, TANK_NORMAL, TANK_SWIFT, TANKS_SPRITES
} from '../constants.js';
import { createOffscreenCanvas } from '../helpers/offscreenCanvas.js';
import DrawingContextCls from '../DrawingContext.js';

const PADDING_SIZE = 20;

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;

const SCORE_TANKS = [TANK_NORMAL, TANK_SWIFT, TANK_MEDIUM, TANK_HEAVY];

export default
class ScoresScene extends Scene {
  gameObjects = [];

  showScores = {};

  showTotal = false;

  total = 0;

  constructor({ SceneManager, DrawingContext, ResourceManager, GameState, Sounds, di }) {
    super();

    this.di = di;
    this.sceneManager = SceneManager;
    this.drawingContext = DrawingContext;
    this.resourceManager = ResourceManager;
    this.gameState = GameState;
    this.sounds = Sounds;

    this.canvas = createOffscreenCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.context = new DrawingContextCls({ canvas: this.canvas });
  }

  async loading() {
    await this.resourceManager.loadResources([
      FILENAME_SPRITES
    ]);

    this.showTotal = false;
    this.showScores = {
      [TANK_NORMAL]: null,
      [TANK_SWIFT]: null,
      [TANK_MEDIUM]: null,
      [TANK_HEAVY]: null
    };
    this.timer = setInterval(() => {
      this.sounds.stop();
      let sum = 0;
      for (const tankType of SCORE_TANKS) {
        if (this.showScores[tankType] === null) {
          this.showScores[tankType] = 0;
          break;
        }
        sum += this.showScores[tankType];
        if (this.showScores[tankType] !== this.gameState.kills[tankType]) {
          this.showScores[tankType]++;
          break;
        }
        if (tankType === SCORE_TANKS[SCORE_TANKS.length - 1]) { // last
          this.showTotal = true;
          clearInterval(this.timer);
          this.timer = null;
          setTimeout(() => {
            this.sceneManager.loadScene(this.di.get('GameScene'));
          }, DELAY_BEFORE_NEXT_LEVEL_SCORES)
        }
      }
      this.total = sum;
      this.sounds.play('score', ['score']);
    }, 100);
  }

  async draw() {
    this.drawingContext.clear('#000');

    this.context.drawText('ОЧКИ', SCREEN_WIDTH / 2 - 20, 100, { size: 24, align: 'right', color: '#b53121' });
    this.context.drawText(this.gameState.killsScore, SCREEN_WIDTH / 2 + 20, 100, { size: 24, align: 'left', color: '#fc9900' });

    this.context.drawText(this.gameState.stage.title, SCREEN_WIDTH / 2, 150, { size: 24, align: 'center', color: '#fff' });
    this.context.drawText(this.gameState.stage.subtitle, SCREEN_WIDTH / 2, 190, { size: 18, align: 'center', color: '#fff' });

    this.context.drawText('ГРАВЕЦЬ 1', SCREEN_WIDTH / 2 - 160, 250, { size: 24, align: 'right', color: '#b53121' });
    this.context.drawText('СЛАВА ЗСУ!', SCREEN_WIDTH / 2 - 160, 290, { size: 24, align: 'right', color: '#fc9900' });
    // this.context.drawText(this.gameState.killsScore, SCREEN_WIDTH / 2 - 160, 290, { size: 24, align: 'right', color: '#fc9900' });

    for (const tankType of SCORE_TANKS) {
      const [x, y, w, h] = TANKS_SPRITES[tankType][DIRECTION_UP][0];
      const hY = 300 + (h + 40) * (tankType - 1);

      this.context.drawSprite(this.resourceManager.get(FILENAME_SPRITES), x, y, w, h, (SCREEN_WIDTH - w) / 2, hY, w, h);
      if (this.showScores[tankType] !== null) {
        this.context.drawText(this.showScores[tankType], SCREEN_WIDTH / 2 - 20 - w, hY + h - 10, { size: 24, align: 'right', color: '#fff' });
        this.context.drawText(`${this.showScores[tankType] * (100 * tankType)} PTS`, SCREEN_WIDTH / 2 - 110 - w, hY + h - 10, { size: 24, align: 'right', color: '#fff' });
      }
    }
    this.context.drawRect(SCREEN_WIDTH / 2 - 200, 700, 400, 5, '#fff');

    if (this.showTotal) {
      this.context.drawText(`${this.total} СВИНОСОБАК ЗНИЩЕНО`, SCREEN_WIDTH / 2 + 335, 760, {
        size: 24,
        align: 'right',
        color: '#fff'
      });
    }

    const windowWidth = this.drawingContext.width - (PADDING_SIZE * 2);
    const windowHeight = this.drawingContext.height - (PADDING_SIZE * 2);
    const minSide = Math.min(windowWidth, windowHeight);

    this.drawingContext.clear('#000');
    this.drawingContext.drawImage(this.canvas.getImage(), (windowWidth - minSide) / 2, (windowHeight - minSide) / 2, minSide, minSide);
  }
}
