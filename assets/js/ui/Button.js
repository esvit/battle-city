import Element from './Element.js';
import { DIRECTION_RIGHT, FILENAME_SPRITES, TANK_PLAYER, TANKS_SPRITES } from '../constants.js';

export default
class Button extends Element {
  constructor({ text, resourceManager, ...params }) {
    super(params);

    this.text = text;
    this.state = 0;
    this.resourceManager = resourceManager;
  }

  draw(ctx) {
    super.draw(ctx);

    const [x, y, w, h] = TANKS_SPRITES[TANK_PLAYER][DIRECTION_RIGHT][0];
    ctx.save();
    ctx.font = `normal 18px 'Press Start 2P'`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#636363';
    if (this.disabled) {
      ctx.fillStyle = '#636363';
    } else if (this.state) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(this.resourceManager.get(FILENAME_SPRITES), x, y, w, h, this.x - w, this.y, w * (this.height / h), this.height);
      ctx.fillStyle = '#fff';
    } else {
      ctx.fillStyle = '#fff';
    }
    ctx.fillText(this.text, this.x + 20, this.y + this.height / 2);
    ctx.restore();
  }
}
