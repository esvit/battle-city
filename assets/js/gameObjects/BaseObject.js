import PhysicsEntity from '../physics/PhysicsEntity.js';

export default
class BaseObject {
  constructor({
    x,
    y,
    width,
    height,
    groups
  }) {
    this.physicEntity = new PhysicsEntity({
      x,
      y,
      width,
      height,
      groups,
      ref: this
    });
  }

  get width() {
    return this.physicEntity.width;
  }

  get height() {
    return this.physicEntity.height;
  }

  get x() {
    return this.physicEntity.x;
  }

  set x(x) {
    this.physicEntity.x = x;
  }

  get y() {
    return this.physicEntity.y;
  }

  set y(y) {
    this.physicEntity.y = y;
  }
}
