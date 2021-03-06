export const MAP_SIZE = 26;
export const CELL_SIZE = 32;

export const MAP_OBJECT_EMPTY = 0;
export const MAP_OBJECT_BRICK = 1;
export const MAP_OBJECT_STEEL = 2;
export const MAP_OBJECT_JUNGLE = 3;
export const MAP_OBJECT_WATER = 4;
export const MAP_OBJECT_ICE = 5;
export const MAP_OBJECT_BASE = 6;
export const MAP_OBJECT_BASE_DESTROID = 7;

export const SIDEBAR_WIDTH = 128;
export const SIDEBAR_SPRITE = [1501, 0, 128, 960];
export const LIVES_P1_COORDS = [80, 604];
export const LIVES_P2_COORDS = [80, 700];
export const KILLS_COORDS = [100, 828];

export const FILENAME_SPRITES = 'images/sprites2.png';
export const BG_COLOR = '#636363';

export const PLAYER_LIVES = 3;
export const DEFAULT_SPEED = 4;
export const SWIFT_SPEED = 8;

export const DELAY_BEFORE_NEXT_LEVEL = 5000;
export const DELAY_BEFORE_NEXT_LEVEL_SCORES = 3000;

export
const MAP_OBJECT_SPRITES = {
  [MAP_OBJECT_EMPTY]: [0,0,0,0],
  [MAP_OBJECT_BRICK]: [1052, 0, 32, 32],
  [MAP_OBJECT_STEEL]: [1052, 64, 32, 32],
  [MAP_OBJECT_JUNGLE]: [1116, 128, 32, 32],
  [MAP_OBJECT_WATER]: [1052, 192, 32, 32],
  [MAP_OBJECT_ICE]: [1180, 128, 32, 32],
  [MAP_OBJECT_BASE]: [1244, 128, 64, 64],
  [MAP_OBJECT_BASE_DESTROID]: [1308, 128, 64, 64],
};

export const DIRECTION_UP = 0;
export const DIRECTION_DOWN = 1;
export const DIRECTION_LEFT = 2;
export const DIRECTION_RIGHT = 3;

export const TANK_PLAYER = 0;
export const TANK_NORMAL = 1;
export const TANK_SWIFT = 2;
export const TANK_MEDIUM = 3;
export const TANK_HEAVY = 4;

export const PAUSE_SPRITE = [1184, 704, 156, 28];
export const CONTROLS_SPRITE = [0, 1044, 900, 36];
export const GAME_OVER_SPRITE = [1184, 736, 124, 60];

export const TANKS_SPRITES = {
  [TANK_PLAYER]: {
    [DIRECTION_UP]: [[0, 0, 64, 64], [64, 0, 64, 64]],
    [DIRECTION_DOWN]: [[256, 0, 64, 64], [320, 0, 64, 64]],
    [DIRECTION_LEFT]: [[128, 0, 64, 64], [192, 0, 64, 64]],
    [DIRECTION_RIGHT]: [[384, 0, 64, 64], [448, 0, 64, 64]],
  },
  [TANK_NORMAL]: {
    [DIRECTION_UP]: [[524, 264, 52, 60], [588, 264, 52, 60]],
    [DIRECTION_DOWN]: [[780, 264, 52, 60], [844, 264, 52, 60]],
    [DIRECTION_LEFT]: [[648, 272, 60, 52], [712, 272, 60, 52]],
    [DIRECTION_RIGHT]: [[908, 268, 60, 52], [972, 268, 60, 52]],
  },
  [TANK_SWIFT]: {
    [DIRECTION_UP]: [[524, 328, 52, 60], [588, 328, 52, 60]],
    [DIRECTION_DOWN]: [[780, 332, 52, 60], [844, 332, 52, 60]],
    [DIRECTION_LEFT]: [[648, 336, 60, 52], [712, 336, 60, 52]],
    [DIRECTION_RIGHT]: [[908, 332, 60, 52], [972, 332, 60, 52]],
  },
  [TANK_MEDIUM]: {
    [DIRECTION_UP]: [[524, 396, 52, 60], [588, 396, 52, 60]],
    [DIRECTION_DOWN]: [[780, 396, 52, 60], [844, 396, 52, 60]],
    [DIRECTION_LEFT]: [[648, 404, 60, 52], [712, 404, 60, 52]],
    [DIRECTION_RIGHT]: [[908, 400, 60, 52], [972, 400, 60, 52]],
  },
  [TANK_HEAVY]: {
    [DIRECTION_UP]: [[524, 460, 52, 60], [588, 460, 52, 60]],
    [DIRECTION_DOWN]: [[780, 460, 52, 60], [844, 460, 52, 60]],
    [DIRECTION_LEFT]: [[648, 464, 60, 52], [712, 464, 60, 52]],
    [DIRECTION_RIGHT]: [[904, 464, 60, 52], [968, 464, 60, 52]],
  }
};

export const BONUS_IMMORTAL = 0;
export const BONUS_FREEZE = 1;
export const BONUS_BASE_STEEL = 2;
export const BONUS_RANK = 3;
export const BONUS_BAYRAKTAR = 4;
export const BONUS_LIFE = 5;

export const MAX_BONUSES_ON_MAP = 2;
export const BONUSES = [
  BONUS_IMMORTAL,
  BONUS_FREEZE,
  BONUS_BASE_STEEL,
  BONUS_RANK,
  BONUS_BAYRAKTAR,
  BONUS_LIFE
];

export const BONUSES_SPRITES = {
  [BONUS_IMMORTAL]: [1052, 448, 64, 60],
  [BONUS_FREEZE]: [1116, 448, 64, 60],
  [BONUS_BASE_STEEL]: [1180, 448, 64, 60],
  [BONUS_RANK]: [1244, 448, 64, 60],
  [BONUS_BAYRAKTAR]: [1308, 448, 64, 60],
  [BONUS_LIFE]: [1372, 448, 64, 60],
};

export const BONUS_TIME_FREEZE = 10 * 1000;
export const BONUS_TIME_IMMORTAL = 10 * 1000;
export const BONUS_TIME_BASE_STEEL = 15 * 1000;

export const BULLET_SPRITE = {
  [DIRECTION_UP]: [1320, 408, 12, 16],
  [DIRECTION_DOWN]: [1384, 408, 12, 16],
  [DIRECTION_LEFT]: [1348, 408, 16, 12],
  [DIRECTION_RIGHT]: [1412, 408, 16, 12]
};

export const IMMORTAL_SPRITE = [[1052, 574, 64, 64], [1116, 574, 64, 64]];
export const BORN_SPRITE = [[1052, 382, 64, 64], [1116, 382, 64, 64], [1180, 382, 64, 64], [1244, 382, 64, 64]];
export const EXPLOSION_SPRITE = [[1052, 512, 64, 64], [1116, 512, 64, 64], [1180, 512, 64, 64], [1244, 512, 128, 128], [1372, 512, 128, 128]];

export const BORN_TIME = 500;
export const EXPLOSION_TIME = 500;
export const IMMORTAL_TIME = 4000;

export const SHOOT_COOLDOWN_DEFAULT = 200;

export const COLLISION_GROUP_ENV = 'env';
export const COLLISION_GROUP_TANK = 'tank';
export const COLLISION_GROUP_BONUS = 'bonus';
export const COLLISION_GROUP_PLAYER_BULLET = 'player_bullet';
export const COLLISION_GROUP_ENEMY_BULLET = 'enemy_bullet';
export const COLLISION_GROUP_BASE = 'base';

export const COLLISION_GROUP_BRICK = `${COLLISION_GROUP_ENV}${MAP_OBJECT_BRICK}`;
export const COLLISION_GROUP_STEEL = `${COLLISION_GROUP_ENV}${MAP_OBJECT_STEEL}`;
export const COLLISION_GROUP_WATER = `${COLLISION_GROUP_ENV}${MAP_OBJECT_WATER}`;
export const COLLISION_GROUP_PLAYER_TANK= `${COLLISION_GROUP_TANK}player`;
export const COLLISION_GROUP_ENEMY_TANK= `${COLLISION_GROUP_TANK}enemy`;

export const COLLISION_GROUPS_PLAYER_TANK = [ // ?? ?????????? ?????????????????????? ???????? ?????????????????? ??????????????
  COLLISION_GROUP_ENV,
  COLLISION_GROUP_WATER,
  COLLISION_GROUP_ENEMY_TANK,
  COLLISION_GROUP_BONUS,
  COLLISION_GROUP_BASE
];
export const COLLISION_GROUPS_ENEMY_TANK = [ // ?? ?????????? ?????????????????????? ???????? ?????????????????? ??????????
  COLLISION_GROUP_ENV,
  COLLISION_GROUP_WATER,
  COLLISION_GROUP_PLAYER_TANK,
  COLLISION_GROUP_BASE
];
export const COLLISION_GROUPS_PLAYER_BULLET = [
  COLLISION_GROUP_ENEMY_BULLET,
  COLLISION_GROUP_BRICK,
  COLLISION_GROUP_STEEL,
  COLLISION_GROUP_ENEMY_TANK,
  COLLISION_GROUP_BASE
];
export const COLLISION_GROUPS_ENEMY_BULLET = [
  COLLISION_GROUP_PLAYER_BULLET,
  COLLISION_GROUP_BRICK,
  COLLISION_GROUP_STEEL,
  COLLISION_GROUP_PLAYER_TANK,
  COLLISION_GROUP_BASE
];
export const SIDEBAR_TANK_SPRITE = [1308, 768, 32, 32];
