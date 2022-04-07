const globalScope = this;

class DependencyInjection {
  #instances = {};

  #proxy = null;

  #parent = null;

  #scope = null;

  static createRoot(scope = null) {
    const di = new DependencyInjection(null, scope);
    di.set('di', di);
    return di;
  }

  constructor(parent = null, scope = null) {
    this.#parent = parent;

    this.#scope = scope || globalScope;

    this.#proxy = new Proxy({}, {
      get: (target, name) => this.get(name),
      set: (target, name, value) => this.set(name, value)
    });
  }

  set(name, value) {
    this.#instances[name] = value;
  }

  get(nameOrClass) {
    const className = typeof nameOrClass === 'string' ? nameOrClass : nameOrClass.prototype.constructor.name;
    if (this.#instances[className]) {
      return this.#instances[className];
    }
    if (this.#parent) {
      return this.#parent.get(nameOrClass);
    }
    try {
      const clsConstr = typeof nameOrClass === 'string' ? (this.#scope[nameOrClass] || eval(nameOrClass)) : nameOrClass;
      this.#instances[className] = new clsConstr(this.#proxy);
      return this.#instances[className];
    } catch (err) {
      // error in eval
      console.error(err);
    }
  }

  scope() {
    return new DependencyInjection(this);
  }
}
