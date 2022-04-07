import Scene from '../Scene.js';
import { createOffscreenCanvas } from '../helpers/offscreenCanvas.js';
import DrawingContextCls from '../DrawingContext.js';

const PADDING_SIZE = 20;

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;

const VICTORY_IMAGE = 'images/victory.png';

export default
class VictoryScene extends Scene {
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
      VICTORY_IMAGE
    ]);

    this.sounds.stop();
    this.sounds.play('victory');
  }

  async draw() {
    const windowWidth = this.drawingContext.width - (PADDING_SIZE * 2);
    const windowHeight = this.drawingContext.height - (PADDING_SIZE * 2);
    const minSide = Math.min(windowWidth, windowHeight);

    this.drawingContext.clear('#3e5ba9');
    this.drawingContext.drawImage(this.resourceManager.get(VICTORY_IMAGE), (windowWidth - minSide) / 2, (windowHeight - minSide) / 2, minSide, minSide);
  }
}
