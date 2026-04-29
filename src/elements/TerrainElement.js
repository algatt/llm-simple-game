import { RoadElement } from './RoadElement.js';
import { SceneryGenerator } from '../systems/SceneryGenerator.js';

export class TerrainElement {
  constructor(options = {}) {
    this.road = options.road ?? new RoadElement();
    this.scenery = options.scenery ?? new SceneryGenerator({ road: this.road });
    this.objects = [];
  }

  create(scene, bounds) {
    const ground = scene.add.rectangle(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      0x5b8c46
    ).setOrigin(0, 0);

    const horizon = scene.add.rectangle(bounds.x, bounds.y, bounds.width, 4, 0x31572c)
      .setOrigin(0, 0);

    const grassLine = scene.add.rectangle(
      bounds.x,
      bounds.y + 18,
      bounds.width,
      6,
      0x7cb342
    ).setOrigin(0, 0);

    this.road.create(scene, bounds);
    this.scenery.create(scene, bounds);
    this.objects = [ground, horizon, grassLine, this.scenery, this.road];
  }

  update(delta, speed) {
    this.road.update(delta, speed);
    this.scenery.update(delta, speed);
  }

  destroy() {
    this.objects.forEach((object) => object.destroy());
    this.objects = [];
  }
}
