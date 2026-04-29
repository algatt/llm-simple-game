import { RoadGenerator } from '../systems/RoadGenerator.js';

export class RoadElement {
  constructor(options = {}) {
    this.topWidth = options.topWidth ?? 78;
    this.bottomWidth = options.bottomWidth ?? 310;
    this.color = options.color ?? 0x4f4f4f;
    this.edgeColor = options.edgeColor ?? 0xe8e1cf;
    this.centerLineColor = options.centerLineColor ?? 0xf6d365;
    this.segments = options.segments ?? 28;
    this.curveStrength = options.curveStrength ?? 2.25;
    this.lookAhead = options.lookAhead ?? 520;
    this.worldSpeedMultiplier = options.worldSpeedMultiplier ?? 42;
    this.distance = 0;
    this.generator = options.generator ?? new RoadGenerator();
    this.bounds = null;
    this.graphics = null;
    this.objects = [];
  }

  create(scene, bounds) {
    this.bounds = bounds;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(2);
    this.objects = [this.graphics];
    this.draw();
  }

  update(delta, speed) {
    this.distance += speed * this.worldSpeedMultiplier * (delta / 1000);
    this.draw();
  }

  draw() {
    if (!this.graphics || !this.bounds) {
      return;
    }

    const roadPoints = this.createRoadPoints(this.bounds);

    this.graphics.clear();
    this.graphics.fillStyle(this.color, 1);
    this.graphics.fillPoints(roadPoints.polygon, true);
    this.drawPolyline(roadPoints.leftEdge, 7, this.edgeColor);
    this.drawPolyline(roadPoints.rightEdge, 7, this.edgeColor);
    this.drawPolyline(roadPoints.centerLine, 5, this.centerLineColor);
  }

  createRoadPoints(bounds) {
    const leftEdge = [];
    const rightEdge = [];
    const centerLine = [];
    const bottomCenterX = bounds.x + bounds.width / 2;
    const bottomY = bounds.y + bounds.height;
    const baseOffset = this.generator.getOffset(this.distance);

    for (let index = 0; index <= this.segments; index += 1) {
      const progress = index / this.segments;
      const horizonProgress = 1 - progress;
      const y = bottomY - bounds.height * progress;
      const roadDistance = this.distance + this.lookAhead * this.easeCurve(progress);
      const centerX = bottomCenterX + this.generator.getOffset(roadDistance) - baseOffset;
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

  drawPolyline(points, width, color) {
    this.graphics.lineStyle(width, color, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(points[0].x, points[0].y);

    points.slice(1).forEach((point) => {
      this.graphics.lineTo(point.x, point.y);
    });

    this.graphics.strokePath();
  }

  destroy() {
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }
}
