const RESOURCE_PATH = 'assets';

export default
class ResourceManager {
  resources = {};

  constructor() {
    this.emptyImage = new Image();
    this.emptyImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  }

  loadResources(list) {
    const resoures = [];
    for (const name of list) {
      const match = name.match(/\.\w+$/i);
      if (!match) {
        continue;
      }
      switch (match[0]) { // file extension
        case '.json':
          this.resources[name] = {};
          resoures.push(this.loadJson(name));
          break;
        default:
        case '.webp':
        case '.png':
        case '.jpg':
        case '.jpeg':
          this.resources[name] = this.emptyImage;
          resoures.push(this.loadImage(name));
      }
    }
    return Promise.all(resoures);
  }

  async loadCss(url) {
    return new Promise((resolve, reject) => {
      let link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.onload = resolve;
      // link.onerror = reject;
      link.href = url;

      let headScript = document.querySelector('script');
      headScript.parentNode.insertBefore(link, headScript);
    });
  }

  async loadJson(file) {
    const res = await fetch(file);
    this.resources[file] = await res.json();
    return this.resources[file];
  }

  loadImage(name) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `${RESOURCE_PATH}/${name}`;
      img.onload = () => {
        this.resources[name] = img;
        resolve(img);
      };
    });
  }

  get(name) {
    return this.resources[name];
  }
}
