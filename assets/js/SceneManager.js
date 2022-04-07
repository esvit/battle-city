export default
class SceneManager {
  currentScene = null;

  constructor({ DrawingContext, InputManager }) {
    this.drawingContext = DrawingContext;
    this.inputManager = InputManager;
  }

  start() {
    this.drawingContext.startLoop();
    this.inputManager.start();

    this.drawingContext.on('draw', () => this.currentScene && this.currentScene.draw())

    this.inputManager.on('click', (event, params) => this.currentScene && this.currentScene.click(params));

    this.inputManager.on('move', (event, params) => this.currentScene && this.currentScene.move(params));

    this.inputManager.on('changeState', (event, params) => this.currentScene && this.currentScene.changeState(params));
  }

  async loadScene(scene) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.currentScene) {
      this.currentScene.pause();
    }

    await scene.loading();

    this.timer = setInterval(() => scene.tick(), 20);

    this.currentScene = scene;

    await scene.start();

    scene.draw();
  }
}
