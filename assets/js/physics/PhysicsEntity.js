// На кінематичні об'єкти не впливає гравітація. Використовується для платформ
export const PHYSICS_TYPE_KINEMATIC = 'kinematic';

// Динамічні сутності будуть повністю змінюватися і на них впливають усі аспекти фізичної системи
export const PHYSICS_TYPE_DYNAMIC = 'dynamic';

// Роздільна здатність переміщення лише перемістить об’єкт за межі простору іншого та обнулить швидкість у цьому напрямку
export const PHYSICS_COLLISION_DISPLACE = 'displace';

// Пружна роздільна здатність зміщує, а також відбиває об'єкт, що стикається, зменшуючи швидкість на його коефіцієнт відновлення
export const PHYSICS_COLLISION_ELASTIC = 'elastic';

const collisions = {
  [PHYSICS_COLLISION_DISPLACE]: (restitution) => this.restitution = restitution || .2,
  [PHYSICS_COLLISION_ELASTIC]: (restitution) => this.restitution = restitution
};

export default
class PhysicsEntity {
  constructor({ x, y, width, height, collisionType, collisionDetector, ref, groups }) {
    this.ref = ref;
    this.groups = groups || [];

    // Position
    this.x = x;
    this.y = y;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Acceleration
    this.ax = 0;
    this.ay = 0;

    this.width = width;
    this.height = height;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.collisionType = collisions[collisionType || PHYSICS_COLLISION_DISPLACE];
    this.collisionDetector = collisionDetector;
  }

  get midX() {
    return this.halfWidth + this.x;
  }

  get midY() {
    return this.halfHeight + this.y;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  isCollideRect({ left, top, right, bottom }) {
    return !(this.bottom - 1 < top + 1 || this.top + 1 > bottom - 1 || this.right - 1 < left + 1 || this.left + 1 > right - 1);
  }

  drawDebug(ctx) {
    ctx.lines([
      { x1: this.left, y1: this.top, x2: this.right, y2: this.top },
      { x1: this.left, y1: this.top, x2: this.left, y2: this.bottom },
      { x1: this.right, y1: this.top, x2: this.right, y2: this.bottom },
      { x1: this.left, y1: this.bottom, x2: this.right, y2: this.bottom }
    ], 'blue');
  }
}
