import {
  FILENAME_SPRITES,
  SIDEBAR_SPRITE,
  SIDEBAR_TANK_SPRITE,
  LIVES_P1_COORDS,
  LIVES_P2_COORDS,
  KILLS_COORDS, BG_COLOR,
} from '../constants.js';
import DrawingContext from '../DrawingContext.js';
import { createOffscreenCanvas } from '../helpers/offscreenCanvas.js';

export default
class GameSidebar {
  constructor({ ResourceManager, GameState }) {
    this.resourceManager = ResourceManager;

    const [,, spriteWidth, spriteHeight] = SIDEBAR_SPRITE;
    this.canvas = createOffscreenCanvas(spriteWidth, spriteHeight);
    this.context = new DrawingContext({ canvas: this.canvas });
    this.gameState = GameState;
  }

  draw() {
    const [spriteX, spriteY, spriteWidth, spriteHeight] = SIDEBAR_SPRITE;
    const [livesP1X, livesP1Y] = LIVES_P1_COORDS;
    const [livesP2X, livesP2Y] = LIVES_P2_COORDS;
    const [killsX, killsY] = KILLS_COORDS;

    // important set size after getContext
    this.canvas.width = spriteWidth;
    this.canvas.height = spriteHeight;
    this.context.drawSprite(
      this.resourceManager.get(FILENAME_SPRITES),
      spriteX, spriteY, spriteWidth, spriteHeight,
      0, 0, spriteWidth, spriteHeight
    );

    this.gameState.tanks.forEach((val, index) => {
      this.drawTankSprite(index);
    });

    this.context.drawText(`${this.gameState.lives}`, livesP1X, livesP1Y);
    // this.context.drawText(`3`, livesP2X, livesP2Y);
    this.context.drawRect(livesP2X - 100, livesP2Y - 60, 120, 80, BG_COLOR)
    this.context.drawText(`${this.gameState.killsCount}`, killsX, killsY, { align: 'right' });

    return this.canvas.getImage();
  }

  drawTankSprite(index) {
    const [x, y, width, height] = SIDEBAR_TANK_SPRITE;

    const col = (index % 2);
    const row = Math.floor(index / 2);

    this.context.drawSprite(
      this.resourceManager.get(FILENAME_SPRITES),
      x, y, width, height,
      31 + (col * height), 96 + (row * height), width, height
    );
  }
}
