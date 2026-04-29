export class HouseElement {
  constructor(options = {}) {
    this.width = options.width ?? 92;
    this.height = options.height ?? 76;
    this.type = options.type ?? 'cottage';
    this.wallColor = options.wallColor ?? 0xf1d0a5;
    this.roofColor = options.roofColor ?? 0x8f3f2f;
    this.doorColor = options.doorColor ?? 0x5b3422;
    this.windowColor = options.windowColor ?? 0xbde7ff;
    this.windows = options.windows ?? 2;
    this.container = null;
  }

  create(scene, x, y, scale = 1) {
    this.container = scene.add.container(x, y);
    this.container.setScale(scale);
    this.container.setDepth(5 + y / 1000);

    const body = scene.add.rectangle(0, 0, this.width, this.height, this.wallColor)
      .setOrigin(0.5, 1);
    const roof = this.createRoof(scene);
    const door = scene.add.rectangle(0, -8, 12, 22, this.doorColor)
      .setOrigin(0.5, 1);
    const windows = this.createWindows(scene);

    this.container.add([body, roof, door, ...windows]);
    return this.container;
  }

  createRoof(scene) {
    if (this.type === 'flat') {
      return scene.add.rectangle(0, -this.height, this.width + 10, 10, this.roofColor)
        .setOrigin(0.5, 1);
    }

    const roofHeight = Math.max(24, this.height * 0.45);
    const roof = scene.add.graphics();

    roof.fillStyle(this.roofColor, 1);
    roof.fillTriangle(
      -this.width / 2 - 10,
      -this.height,
      this.width / 2 + 10,
      -this.height,
      0,
      -this.height - roofHeight
    );

    return roof;
  }

  createWindows(scene) {
    const windows = [];
    const count = Math.max(1, this.windows);
    const spacing = this.width / (count + 1);

    for (let index = 0; index < count; index += 1) {
      const x = -this.width / 2 + spacing * (index + 1);
      const window = scene.add.rectangle(x, -this.height + 26, 14, 14, this.windowColor)
        .setOrigin(0.5);

      windows.push(window);
    }

    return windows;
  }

  destroy() {
    this.container?.destroy();
    this.container = null;
  }
}
