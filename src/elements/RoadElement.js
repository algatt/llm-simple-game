import Phaser from 'phaser';

export class RoadElement {
  constructor(options = {}) {
    this.curveX = options.curveX ?? 0;
    this.topWidth = options.topWidth ?? 78;
    this.bottomWidth = options.bottomWidth ?? 310;
    this.color = options.color ?? 0x4f4f4f;
    this.edgeColor = options.edgeColor ?? 0xe8e1cf;
    this.centerLineColor = options.centerLineColor ?? 0xf6d365;
    this.segments = options.segments ?? 28;
    this.curveStrength = options.curveStrength ?? 1.7;
    this.objects = [];
  }

  create(scene, bounds) {
    const roadPoints = this.createRoadPoints(bounds);
    const road = scene.add.polygon(0, 0, roadPoints.polygon, this.color)
      .setOrigin(0, 0);

    const leftEdge = this.createCurve(scene, roadPoints.leftEdge, 7, this.edgeColor);
    const rightEdge = this.createCurve(scene, roadPoints.rightEdge, 7, this.edgeColor);
    const centerLine = this.createCurve(scene, roadPoints.centerLine, 5, this.centerLineColor);

    this.objects = [road, leftEdge, rightEdge, centerLine];
  }

  createRoadPoints(bounds) {
    const leftEdge = [];
    const rightEdge = [];
    const centerLine = [];
    const bottomCenterX = bounds.x + bounds.width / 2;
    const bottomY = bounds.y + bounds.height;

    for (let index = 0; index <= this.segments; index += 1) {
      const progress = index / this.segments;
      const horizonProgress = 1 - progress;
      const y = bottomY - bounds.height * progress;
      const centerX = bottomCenterX + this.curveX * this.easeCurve(progress);
      const width = this.topWidth + (this.bottomWidth - this.topWidth) * horizonProgress;

      leftEdge.push({ x: centerX - width / 2, y });
      rightEdge.push({ x: centerX + width / 2, y });
      centerLine.push({ x: centerX, y });
    }

    return {
      leftEdge,
      rightEdge,
      centerLine,
      polygon: [...leftEdge, ...[...rightEdge].reverse()]
    };
  }

  easeCurve(progress) {
    return progress ** this.curveStrength;
  }

  createCurve(scene, points, width, color) {
    const curve = new Phaser.Curves.Spline(points);
    const graphic = scene.add.graphics();

    graphic.lineStyle(width, color, 1);
    curve.draw(graphic, 64);
    return graphic;
  }

  destroy() {
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }
}
