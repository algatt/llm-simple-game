export class TreeElement {
  constructor(options = {}) {
    this.height = options.height ?? 110;
    this.trunkWidth = options.trunkWidth ?? 18;
    this.trunkColor = options.trunkColor ?? 0x6f4e37;
    this.leafColor = options.leafColor ?? 0x2f7d32;
    this.type = options.type ?? 'round';
    this.canopySize = options.canopySize ?? 58;
    this.container = null;
  }

  create(scene, x, y, scale = 1) {
    this.container = scene.add.container(x, y);
    this.container.setScale(scale);
    this.container.setDepth(5 + y / 1000);

    const trunk = scene.add.rectangle(
      0,
      0,
      this.trunkWidth,
      this.height * 0.48,
      this.trunkColor
    ).setOrigin(0.5, 1);

    const canopy = this.createCanopy(scene);

    this.container.add([trunk, ...canopy]);
    return this.container;
  }

  createCanopy(scene) {
    if (this.type === 'pine') {
      return [
        this.createTriangle(scene, -this.height * 0.36, this.canopySize * 1.08),
        this.createTriangle(scene, -this.height * 0.56, this.canopySize * 0.88),
        this.createTriangle(scene, -this.height * 0.72, this.canopySize * 0.68)
      ];
    }

    return [
      scene.add.circle(0, -this.height * 0.58, this.canopySize * 0.48, this.leafColor),
      scene.add.circle(-this.canopySize * 0.25, -this.height * 0.48, this.canopySize * 0.34, this.leafColor),
      scene.add.circle(this.canopySize * 0.28, -this.height * 0.5, this.canopySize * 0.36, this.leafColor)
    ];
  }

  createTriangle(scene, y, width) {
    const height = width * 0.82;
    const graphic = scene.add.graphics();

    graphic.fillStyle(this.leafColor, 1);
    graphic.fillTriangle(-width / 2, y, width / 2, y, 0, y - height);
    return graphic;
  }

  destroy() {
    this.container?.destroy();
    this.container = null;
  }
}
