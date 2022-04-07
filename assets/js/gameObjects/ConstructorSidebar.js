import {
  CELL_SIZE,
  FILENAME_SPRITES,
  MAP_OBJECT_BRICK, MAP_OBJECT_EMPTY,
  MAP_OBJECT_ICE,
  MAP_OBJECT_JUNGLE,
  MAP_OBJECT_SPRITES,
  MAP_OBJECT_STEEL,
  MAP_OBJECT_WATER,
  SIDEBAR_SPRITE
} from '../constants.js';
import DrawingContext from '../DrawingContext.js';
import { createOffscreenCanvas } from '../helpers/offscreenCanvas.js';

const TOOLS = [MAP_OBJECT_EMPTY, MAP_OBJECT_BRICK, MAP_OBJECT_STEEL, MAP_OBJECT_JUNGLE, MAP_OBJECT_WATER, MAP_OBJECT_ICE];

export default
class ConstructorSidebar {
  currentMapImage = null;

  constructor({ ResourceManager }) {
    this.resourceManager = ResourceManager;

    const [,, spriteWidth, spriteHeight] = SIDEBAR_SPRITE;
    this.canvas = createOffscreenCanvas(spriteWidth, spriteHeight);
    this.context = new DrawingContext({ canvas: this.canvas });

    this.selectedTool = MAP_OBJECT_BRICK;
  }

  draw() {
    const [spriteX, spriteY, spriteWidth, spriteHeight] = SIDEBAR_SPRITE;

    // important set size after getContext
    this.canvas.width = spriteWidth;
    this.canvas.height = spriteHeight;
    this.context.drawRect(0, 0, spriteWidth, spriteHeight, '#636363');

    const drawIcon = (icon, x, y, selected) => {
      if (selected) {
        this.context.drawRect(x - 3, y - 3, CELL_SIZE + 6, CELL_SIZE + 6, 'red');
      }
      if (icon === MAP_OBJECT_EMPTY) {
        this.context.drawRect(x, y, CELL_SIZE, CELL_SIZE, '#000');
      } else {
        const [spriteX, spriteY, spriteWidth, spriteHeight] = MAP_OBJECT_SPRITES[icon];
        this.context.drawSprite(
          this.resourceManager.get(FILENAME_SPRITES),
          spriteX, spriteY, spriteWidth, spriteHeight,
          x, y, CELL_SIZE, CELL_SIZE
        );
      }
    };

    let n = 0;
    for (const tool of TOOLS) {
      drawIcon(tool, 20, n * 50 + 20, this.selectedTool === tool);
      n++;
    }
    return this.canvas.getImage();
  }

  click({ x, y }) {
    let n = 0;
    for (const tool of TOOLS) {
      const hY = n * 50 + 20;
      if (x >= 10 && x <= CELL_SIZE + 10 && y >= hY && y <= hY + CELL_SIZE) {
        this.selectedTool = tool;
        return;
      }
      n++;
    }
  }
}
