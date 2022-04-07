export default
class PhysicsWorld {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.objects = [];
  }

  addObject(object) {
    this.objects.push(object);
  }

  removeObject(object) {
    this.objects = this.objects.filter((obj) => obj !== object)
  }

  clear() {
    this.objects = [];
  }

  drawDebug(ctx) {
    ctx.ctx.lineWidth = 3;
    for (const obj of this.objects) {
      obj.drawDebug(ctx);
    }
    ctx.ctx.lineWidth = 1;
  }

  isOutOfWorld({ left, top, right, bottom }) {
    return (left < 0 || top < 0 || right > this.width || bottom > this.height);
  }

  getCollisions(object, groups = null) {
    const objs = [];
    for (const obj of this.objects) {
      let isValid = groups && groups.reduce((acc, group) => acc || obj.groups.includes(group), false);
      if (!isValid || obj === object) {
        continue;
      }
      if (obj.isCollideRect(object)) {
        objs.push(obj);
      }
    }
    return objs;
  }
}
