import Scene from '../Scene.js';
import Button from '../ui/Button.js';
import { createOffscreenCanvas } from '../helpers/offscreenCanvas.js';
import DrawingContextCls from '../DrawingContext.js';
import { FILENAME_SPRITES } from '../constants.js';

const LOGO_SPRITES = 'images/logo.png';

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;

export default
class MenuScene extends Scene {
  elements = [];

  constructor({ di, SceneManager, ResourceManager, DrawingContext, canvas, GameState, Translation }) {
    super();

    this.di = di;
    this.resourceManager = ResourceManager;
    this.drawingContext = DrawingContext;
    this.sceneManager = SceneManager;
    this.canvas = canvas;
    this.gameState = GameState;
    this.translation = Translation;

    this.canvas = createOffscreenCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.context = new DrawingContextCls({ canvas: this.canvas });
  }

  move({ x, y }) {
    const { x: offsetX, y: offsetY } = this.mapToCanvas(x, y);

    for (const element of this.elements) {
      if (offsetX >= element.x && offsetY >= element.y && offsetX <= element.x + element.width && offsetY <= element.y + element.height) {
        element.state = 1;
      } else {
        element.state = 0;
      }
    }
  }

  mapToCanvas(x, y) {
    const windowWidth = this.drawingContext.width;
    const windowHeight = this.drawingContext.height;
    const minSide = Math.min(windowWidth, windowHeight);

    // draw sidebar
    const offsetX = (this.drawingContext.width - minSide) / 2;
    const offsetY = (this.drawingContext.height - minSide) / 2;

    return {
      x: (x - offsetX) / (minSide / SCREEN_WIDTH),
      y: (y - offsetY) / (minSide / SCREEN_HEIGHT)
    };
  }

  async loading() {
    await this.resourceManager.loadCss('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    await this.resourceManager.loadResources([
      LOGO_SPRITES,
      FILENAME_SPRITES
    ]);

    this.elements = [
      new Button({
        x: 0,
        y: 450,
        width: 300,
        height: 50,
        resourceManager: this.resourceManager,
        text: this.translation.get('1player'),
        click: () => {
          this.gameState.newGame();
          this.sceneManager.loadScene(this.di.get('GameScene'));
        }
      }),
      new Button({
        x: 0,
        y: 505,
        width: 300,
        height: 50,
        disabled: true,
        resourceManager: this.resourceManager,
        text: this.translation.get('2players'),
        click: () => {
          this.gameState.newGame();
          this.sceneManager.loadScene(this.di.get('GameScene'));
        }
      }),
      new Button({
        x: 0,
        y: 560,
        width: 300,
        height: 50,
        resourceManager: this.resourceManager,
        text: this.translation.get('constructor'),
        click: () => {
          this.sceneManager.loadScene(this.di.get('ConstructorScene'));
        }
      }),
      new Button({
        x: 0,
        y: 615,
        width: 300,
        height: 50,
        resourceManager: this.resourceManager,
        text: this.translation.get('donate'),
        click: () => {
          window.open('https://www.comebackalive.in.ua/donate');

          gtag('event', 'donate_menu', {});
        }
      })
    ];

    gtag('event', 'impression', {
      'event_category': 'menu',
      'event_label': 'menu_start'
    });
  }

  click({ x, y }) {
    const { x: offsetX, y: offsetY } = this.mapToCanvas(x, y);
    for (const element of this.elements) {
      element.handleClick({ x: offsetX, y: offsetY });
    }
  }

  draw() {
    const LOGO_WIDTH = 655;
    const LOGO_HEIGHT = 287;
    const MENU_HEIGHT = 200;
    const offsetX = (SCREEN_WIDTH - LOGO_WIDTH) / 2;
    const offsetY = 50;
    this.context.clear('#000');
    this.context.drawImage(this.resourceManager.get(LOGO_SPRITES), offsetX, offsetY, LOGO_WIDTH, LOGO_HEIGHT);

    for (const element of this.elements) {
      element.x = offsetX + 200;
      element.draw(this.context.ctx);
    }

    let minSide = Math.min(window.innerWidth, window.innerHeight);

    this.context.drawImage(this.resourceManager.get(LOGO_SPRITES), offsetX, offsetY, LOGO_WIDTH, LOGO_HEIGHT);

    this.drawingContext.clear('#000');
    this.drawingContext.drawImage(this.canvas.getImage(), (window.innerWidth - minSide) / 2, (window.innerHeight - minSide) / 2, minSide, minSide);
  }
}
