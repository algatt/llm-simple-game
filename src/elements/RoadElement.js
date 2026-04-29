import Phaser from 'phaser';
import { RoadGenerator } from '../systems/RoadGenerator.js';

export class RoadElement {
  constructor(options = {}) {
    this.topWidth = options.topWidth ?? 78;
    this.bottomWidth = options.bottomWidth ?? 310;
    this.color = options.color ?? 0x4f4f4f;
    this.farColor = options.farColor ?? 0x70787f;
    this.edgeColor = options.edgeColor ?? 0xe8e1cf;
    this.shoulderColor = options.shoulderColor ?? 0xb78b54;
    this.centerLineColor = options.centerLineColor ?? 0xf6d365;
    this.shoulderWidth = options.shoulderWidth ?? 24;
    this.farAlpha = options.farAlpha ?? 0.52;
    this.nearAlpha = options.nearAlpha ?? 1;
    this.dashLength = options.dashLength ?? 34;
    this.dashGap = options.dashGap ?? 28;
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

  getDistance() {
    return this.distance;
  }

  getSampleAtDistance(distance) {
    if (!this.bounds) {
      return null;
    }

    const relativeDistance = distance - this.distance;

    if (relativeDistance < 0 || relativeDistance > this.lookAhead) {
      return null;
    }

    const progress = (relativeDistance / this.lookAhead) ** (1 / this.curveStrength);
    const perspective = 1 - progress ** 1.45;
    const bottomCenterX = this.bounds.x + this.bounds.width / 2;
    const bottomY = this.bounds.y + this.bounds.height;
    const centerX = bottomCenterX + this.generator.getOffset(distance);
    const y = bottomY - this.bounds.height * progress;
    const width = this.topWidth + (this.bottomWidth - this.topWidth) * perspective;

    return {
      centerX,
      y,
      width,
      progress,
      scale: 0.12 + 0.88 * perspective
    };
  }

  getSampleAtY(y) {
    if (!this.bounds) {
      return null;
    }

    const progress = Phaser.Math.Clamp(
      (this.bounds.y + this.bounds.height - y) / this.bounds.height,
      0,
      1
    );
    const roadDistance = this.distance + this.lookAhead * this.easeCurve(progress);
    const perspective = 1 - progress ** 1.45;
    const bottomCenterX = this.bounds.x + this.bounds.width / 2;
    const centerX = bottomCenterX + this.generator.getOffset(roadDistance);
    const width = this.topWidth + (this.bottomWidth - this.topWidth) * perspective;

    return {
      centerX,
      width,
      left: centerX - width / 2,
      right: centerX + width / 2,
      progress
    };
  }

  isPointOnRoad(x, y) {
    const sample = this.getSampleAtY(y);

    if (!sample) {
      return false;
    }

    return x >= sample.left && x <= sample.right;
  }

  draw() {
    if (!this.graphics || !this.bounds) {
      return;
    }

    const roadPoints = this.createRoadPoints(this.bounds);

    this.graphics.clear();
    this.drawShoulders(roadPoints);
    this.drawRoadSurface(roadPoints);
    this.drawEdge(roadPoints.leftEdge);
    this.drawEdge(roadPoints.rightEdge);
    this.drawDashedCenterLine(roadPoints.centerLine);
  }

  createRoadPoints(bounds) {
    const leftEdge = [];
    const rightEdge = [];
    const centerLine = [];
    const bottomCenterX = bounds.x + bounds.width / 2;
    const bottomY = bounds.y + bounds.height;

    for (let index = 0; index <= this.segments; index += 1) {
      const progress = index / this.segments;
      const perspective = 1 - progress ** 1.45;
      const y = bottomY - bounds.height * progress;
      const roadDistance = this.distance + this.lookAhead * this.easeCurve(progress);
      const centerX = bottomCenterX + this.generator.getOffset(roadDistance);
      const width = this.topWidth + (this.bottomWidth - this.topWidth) * perspective;

      leftEdge.push({ x: centerX - width / 2, y, progress });
      rightEdge.push({ x: centerX + width / 2, y, progress });
      centerLine.push({ x: centerX, y, progress });
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

  drawRoadSurface(roadPoints) {
    for (let index = 0; index < roadPoints.leftEdge.length - 1; index += 1) {
      const nearLeft = roadPoints.leftEdge[index];
      const farLeft = roadPoints.leftEdge[index + 1];
      const nearRight = roadPoints.rightEdge[index];
      const farRight = roadPoints.rightEdge[index + 1];
      const progress = (nearLeft.progress + farLeft.progress) / 2;

      this.graphics.fillStyle(this.colorForProgress(progress), 1);
      this.graphics.fillPoints([nearLeft, nearRight, farRight, farLeft], true);
    }
  }

  drawShoulders(roadPoints) {
    for (let index = 0; index < roadPoints.leftEdge.length - 1; index += 1) {
      const nearLeft = roadPoints.leftEdge[index];
      const farLeft = roadPoints.leftEdge[index + 1];
      const nearRight = roadPoints.rightEdge[index];
      const farRight = roadPoints.rightEdge[index + 1];
      const progress = (nearLeft.progress + farLeft.progress) / 2;
      const shoulderWidth = this.shoulderWidth * (1 - progress * 0.55);
      const alpha = 1 - progress * 0.25;

      this.graphics.fillStyle(this.shoulderColor, alpha);
      this.graphics.fillPoints([
        { x: nearLeft.x - shoulderWidth, y: nearLeft.y },
        nearLeft,
        farLeft,
        { x: farLeft.x - shoulderWidth, y: farLeft.y }
      ], true);
      this.graphics.fillPoints([
        nearRight,
        { x: nearRight.x + shoulderWidth, y: nearRight.y },
        { x: farRight.x + shoulderWidth, y: farRight.y },
        farRight
      ], true);
    }
  }

  drawEdge(points) {
    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index];
      const end = points[index + 1];
      const progress = (start.progress + end.progress) / 2;
      const width = 7 - 3 * progress;

      this.drawLine(start, end, width, this.edgeColor, this.alphaForProgress(progress));
    }
  }

  drawDashedCenterLine(points) {
    let dashCursor = (this.distance * 0.55) % (this.dashLength + this.dashGap);

    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index];
      const end = points[index + 1];
      const segmentLength = Math.hypot(end.x - start.x, end.y - start.y);
      const progress = (start.progress + end.progress) / 2;

      if (dashCursor < this.dashLength) {
        const width = 5 - 2.8 * progress;

        this.drawLine(start, end, width, this.centerLineColor, this.alphaForProgress(progress));
      }

      dashCursor = (dashCursor + segmentLength) % (this.dashLength + this.dashGap);
    }
  }

  drawLine(start, end, width, color, alpha) {
    this.graphics.lineStyle(width, color, alpha);
    this.graphics.beginPath();
    this.graphics.moveTo(start.x, start.y);
    this.graphics.lineTo(end.x, end.y);
    this.graphics.strokePath();
  }

  alphaForProgress(progress) {
    return this.nearAlpha + (this.farAlpha - this.nearAlpha) * progress;
  }

  colorForProgress(progress) {
    return Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(this.color),
      Phaser.Display.Color.ValueToColor(this.farColor),
      1,
      progress
    ).color;
  }

  destroy() {
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }
}
