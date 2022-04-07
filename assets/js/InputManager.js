import EventEmitter from './EventEmitter.js';

export default
class InputManager extends EventEmitter {
  constructor({ canvas }) {
    super();

    this.canvas = canvas;
    this.state = {};
  }

  start() {
    this.canvas.addEventListener('click', (e) => {
      this.emit('click', { x: e.pageX, y: e.pageY });
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this.emit('move', { x: e.pageX, y: e.pageY });
    });
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.state[e.code]) {
        this.state[e.code] = true;
        this.emit('changeState', this.state);
      }
    });
    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.state[e.code]) {
        this.state[e.code] = false;
        this.emit('changeState', this.state);
      }
    });
  }
}
