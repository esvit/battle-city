export default
class EventEmitter {
  events = {};

  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return;
    }
    for (const func of this.events[eventName]) {
      func(eventName, ...args);
    }
  }

  on(eventName, func) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(func);
  }
}
