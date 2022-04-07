export
function createOffscreenCanvas(w, h) {
  const isOffscreen = typeof OffscreenCanvas !== 'undefined';
  const canvas = isOffscreen ? new OffscreenCanvas(w, h) : document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.isOffscreen = isOffscreen;

  return {
    getContext: canvas.getContext.bind(canvas),
    getImage() {
      if (isOffscreen) {
        return canvas.transferToImageBitmap();
      }
      return canvas;
    }
  };
}
