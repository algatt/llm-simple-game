export class SkyElement {
  constructor() {
    this.objects = [];
  }

  create(scene, bounds) {
    const sky = scene.add.rectangle(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      0x7dc7ff
    ).setOrigin(0, 0);

    const sun = scene.add.circle(bounds.width - 96, 82, 34, 0xffd166);
    const cloudA = this.createCloud(scene, 150, 105, 1);
    const cloudB = this.createCloud(scene, 690, 145, 0.75);

    this.objects = [sky, sun, ...cloudA, ...cloudB];
  }

  createCloud(scene, x, y, scale) {
    return [
      scene.add.ellipse(x, y, 82 * scale, 34 * scale, 0xf5f7fb),
      scene.add.ellipse(x + 38 * scale, y + 4 * scale, 70 * scale, 30 * scale, 0xf5f7fb),
      scene.add.ellipse(x - 34 * scale, y + 6 * scale, 58 * scale, 28 * scale, 0xf5f7fb)
    ];
  }

  destroy() {
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }
}
