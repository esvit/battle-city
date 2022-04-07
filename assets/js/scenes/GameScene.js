import Scene from '../Scene.js';
import Tank from '../gameObjects/Tank.js';
import {
  TANK_PLAYER,
  SIDEBAR_WIDTH,
  FILENAME_SPRITES,
  DIRECTION_DOWN,
  DIRECTION_UP,
  DIRECTION_RIGHT,
  DIRECTION_LEFT,
  CELL_SIZE,
  MAP_SIZE,
  BG_COLOR, PAUSE_SPRITE, CONTROLS_SPRITE, GAME_OVER_SPRITE, DELAY_BEFORE_NEXT_LEVEL
} from '../constants.js';
import AIPlayer from '../AIPlayer.js';
import JoyStick from '../helpers/joystick.js';

const JOYSTICK_MEDIA_QUERY = 'screen and (max-device-width: 768px)';

export default
class GameScene extends Scene {
  nextEnemyPlace = 1;

  isStarted = false;

  isPause = false;

  constructor({ DrawingContext, ResourceManager, GameMap, GameSidebar, Sounds, SceneManager, GameState, di }) {
    super();

    this.drawingContext = DrawingContext;
    this.resourceManager = ResourceManager;
    this.map = GameMap;
    this.sidebar = GameSidebar;
    this.sounds = Sounds;
    this.sceneManager = SceneManager;
    this.gameState = GameState;
    this.di = di;
  }

  drawStage() {
    let n = Date.now();
    const time = 500;
    this.sounds.stop();
    this.sounds.play('start');
    return () => {
      let change = Date.now() - n;
      if (change > time) {
        change = time;
        setTimeout(() => {
          this.isStarted = true;
        }, 1500);
      }
      const height = (this.drawingContext.height / 2) * (change / time);
      this.drawingContext.clear('#000');
      this.drawingContext.drawRect(0, 0, this.drawingContext.width, height, '#0089fb');
      this.drawingContext.drawRect(0, this.drawingContext.height - height, this.drawingContext.width, this.drawingContext.height, '#ffda00');
      this.drawingContext.drawText(this.gameState.stage.title, this.drawingContext.width / 2, this.drawingContext.height / 2 - 20);
      this.drawingContext.drawText(this.gameState.stage.subtitle, this.drawingContext.width / 2, this.drawingContext.height / 2 + 40, { size: 18 });
    };
  }

  get isMobile() {
    if (typeof window.matchMedia !== 'undefined') {
      const { matches } = window.matchMedia(JOYSTICK_MEDIA_QUERY);
      return matches;
    }
    return false;
  }

  async loading() {
    this.isStarted = false;
    this.gameState.loadStage();

    this.map.putBase();
    this.map.putEnemiesPlaces();
    this.map.setMap(this.gameState.stage.map);

    const input = {};
    if (!this.joystick && this.isMobile) {
      this.joystick = new JoyStick('jContainer1', {
        internalFillColor: '#0089fb',
        internalStrokeColor: '#004a86',
        externalStrokeColor: '#004a86'
      }, (stickData) => {
        if (stickData.cardinalDirection.length > 1) {
          return;
        }
        input.ArrowUp = false;
        input.ArrowLeft = false;
        input.ArrowDown = false;
        input.ArrowRight = false;
        const data = stickData.cardinalDirection.split('');
        for (const letter of data) {
          switch (letter) {
            case 'N':
              input.ArrowUp = true;
              break;
            case 'S':
              input.ArrowDown = true;
              break;
            case 'W':
              input.ArrowLeft = true;
              break;
            case 'E':
              input.ArrowRight = true;
              break;
          }
        }

        this.changeState(input)
      });
      this.joystick2 = new JoyStick('jContainer2', {
        button: true,
        internalFillColor: '#ffda00',
        internalStrokeColor: '#ab9516',
        externalStrokeColor: '#ab9516'
      }, (stickData) => {
        input.Space = stickData.pressed;
        this.changeState(input);
      });
    }

    this.map.onWin = () => {
      gtag('event', 'level_end', {
        success: true,
        level_name: `${this.gameState.currentStage}`
      });
      setTimeout(() => {
        this.gameState.currentStage++;
        if (this.gameState.currentStage > this.gameState.maxStageIndex) {
          this.sceneManager.loadScene(this.di.get('VictoryScene'));

          gtag('event', 'game_end', {});
        } else {
          this.sceneManager.loadScene(this.di.get('ScoresScene'));
        }
      }, DELAY_BEFORE_NEXT_LEVEL)
    };

    await this.resourceManager.loadResources([
      FILENAME_SPRITES
    ]);

    this.playerTank = new Tank({
      x: 0,
      y: 0,
      type: TANK_PLAYER,
      direction: DIRECTION_UP,
      ResourceManager: this.resourceManager,
      Sounds: this.sounds,
      map: this.map,
      GameState: this.gameState
    });
    this.map.putPlayer1(this.playerTank);

    this.playerTank.born();
    this.map.isConstructor = false;
    // this.map.isDebug = true;
    this.inputState = {
      isUp: false,
      isDown: false,
      isLeft: false,
      isRight: false,
      isShoot: false
    };

    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (this.map.isDefeat) {
        clearInterval(this.timer);
        this.timer = null;
        return;
      }
      if (!this.gameState.tanks.length || this.isPause) {
        return;
      }
      const tankType = this.gameState.tanks.shift();
      const tank = this.createEnemyTank(tankType);
      tank.isBonus = this.gameState.tanks.length % 5 === 0;
    }, this.gameState.enemyTankBornTimeout || 5000);
    this.onStartDraw = this.drawStage();
  }

  async draw() {
    if (!this.isStarted) {
      return this.onStartDraw();
    }

    const PADDING_SIZE_X = 0;
    const PADDING_SIZE_Y = 20;

    this.drawingContext.clear(BG_COLOR);

    let windowWidth = this.drawingContext.width - SIDEBAR_WIDTH;
    let windowHeight = this.drawingContext.height - (PADDING_SIZE_Y * 2);
    if (windowWidth < 400) {
      windowWidth = windowWidth + (PADDING_SIZE_X * 2);
    }
    if (this.isMobile) {
      windowHeight -= PADDING_SIZE_Y;
    }
    const minSide = Math.min(windowWidth, windowHeight);

    // draw sidebar
    const offsetX = (this.drawingContext.width - minSide) / 2;
    const offsetY = (this.drawingContext.height - minSide) / 2;

    const img = this.map.draw(this.isPause);
    this.drawingContext.drawImage(img, offsetX, offsetY, minSide, minSide);

    if (this.isPause) {
      const [x, y, w, h] = PAUSE_SPRITE;
      this.drawingContext.drawSprite(this.resourceManager.get(FILENAME_SPRITES), x, y, w, h, offsetX + (minSide - w) / 2, offsetY + (minSide - h) / 2, w, h)
    }
    if (this.map.isDefeat) {
      const [x, y, w, h] = GAME_OVER_SPRITE;
      this.drawingContext.drawSprite(this.resourceManager.get(FILENAME_SPRITES), x, y, w, h, offsetX + (minSide - w) / 2, offsetY + (minSide - h) / 2, w, h)
    }

    const sidebar = this.sidebar.draw();
    this.drawingContext.drawImage(sidebar, offsetX + minSide, offsetY, sidebar.width * (minSide / sidebar.height), minSide);

    if (!this.isMobile) {
      const [x, y, w, h] = CONTROLS_SPRITE;
      this.drawingContext.drawSprite(this.resourceManager.get(FILENAME_SPRITES), x, y, w, h, offsetX, 0, w / 2, h / 2);
    }
  }

  changeState({
    Space,
    KeyP,
    KeyW, ArrowUp,
    KeyS, ArrowDown,
    KeyA, ArrowLeft,
    KeyD, ArrowRight,
  }) {
    if (KeyP) {
      this.isPause = !this.isPause;
      this.sounds.stop();
    }
    this.inputState.isShoot = Space;
    this.inputState.isUp = KeyW || ArrowUp;
    this.inputState.isDown = KeyS || ArrowDown;
    this.inputState.isLeft = KeyA || ArrowLeft;
    this.inputState.isRight = KeyD || ArrowRight;
  }

  tick() {
    if (this.isStarted) {
      this.map.checkWinState();
    }

    if (this.isPause || this.map.isDefeat) {
      return;
    }
    for (const object of this.map.gameObjects) {
      object.tick();
    }

    if (this.inputState.isUp) {
      this.playerTank.move(DIRECTION_UP);
    } else if (this.inputState.isDown) {
      this.playerTank.move(DIRECTION_DOWN);
    } else if (this.inputState.isLeft) {
      this.playerTank.move(DIRECTION_LEFT);
    } else if (this.inputState.isRight) {
      this.playerTank.move(DIRECTION_RIGHT);
    } else {
      this.playerTank.stop();
    }

    if (this.inputState.isShoot) {
      this.playerTank.shoot();
    }
  }

  createEnemyTank(tankType) {
    let x = 0;
    let y = 0;

    if (this.nextEnemyPlace === 1) {
      x = (MAP_SIZE * CELL_SIZE) / 2 - 1;
    } else if (this.nextEnemyPlace === 2) {
      x = (MAP_SIZE - 2) * CELL_SIZE;
    }
    this.nextEnemyPlace++;
    if (this.nextEnemyPlace === 3) {
      this.nextEnemyPlace = 0;
    }

    const tank = new Tank({
      x,
      y,
      type: tankType,
      direction: DIRECTION_DOWN,
      ResourceManager: this.resourceManager,
      Sounds: this.sounds,
      map: this.map,
      GameState: this.gameState
    });
    tank.player = new AIPlayer({
      tank,
      map: this.map
    });
    tank.born(false);
    this.map.addObject(tank);
    this.map.world.addObject(tank.physicEntity);
    return tank;
  }

  click() {
    if (this.map.isDefeat) {
      this.sceneManager.loadScene(this.di.get('MenuScene'));
    }
  }
}
