import Phaser from 'phaser';
import { HouseElement } from '../elements/HouseElement.js';
import { TreeElement } from '../elements/TreeElement.js';

export class SceneryGenerator {
  constructor(options = {}) {
    this.road = options.road;
    this.interval = options.interval ?? { min: 260, max: 520 };
    this.treeInterval = options.treeInterval ?? { min: 120, max: 280 };
    this.sideOffset = options.sideOffset ?? 82;
    this.treeSideOffset = options.treeSideOffset ?? this.sideOffset + 70;
    this.houseDistance = options.houseDistance ?? 900;
    this.items = [];
    this.nextHouseDistance = 120;
    this.nextTreeDistance = 80;
  }

  create(scene, bounds) {
    this.scene = scene;
    this.bounds = bounds;
  }

  update(delta, speed) {
    if (!this.scene || !this.road) {
      return;
    }

    this.spawnUntilAhead();
    this.items.forEach((item) => this.positionItem(item));
    this.removePassedItems();
  }

  spawnUntilAhead() {
    const targetDistance = this.road.getDistance() + this.houseDistance;

    while (this.nextHouseDistance < targetDistance) {
      this.spawnItem('house', this.nextHouseDistance);
      this.nextHouseDistance += Phaser.Math.Between(this.interval.min, this.interval.max);
    }

    while (this.nextTreeDistance < targetDistance) {
      this.spawnItem('tree', this.nextTreeDistance);
      this.nextTreeDistance += Phaser.Math.Between(this.treeInterval.min, this.treeInterval.max);
    }
  }

  spawnItem(type, distance) {
    const element = type === 'tree'
      ? new TreeElement(this.createTreeOptions())
      : new HouseElement(this.createHouseOptions());
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const item = {
      element,
      type,
      side,
      distance,
      container: element.create(this.scene, 0, 0, 1)
    };

    this.items.push(item);
    this.positionItem(item);
  }

  positionItem(item) {
    const sample = this.road.getSampleAtDistance(item.distance);

    if (!sample) {
      item.container.setVisible(false);
      return;
    }

    const sideMultiplier = item.side === 'left' ? -1 : 1;
    const offset = item.type === 'tree' ? this.treeSideOffset : this.sideOffset;
    const x = sample.centerX + sideMultiplier * (sample.width / 2 + offset * sample.scale);
    const y = sample.y;
    const scale = item.type === 'tree'
      ? 0.16 + 1.45 * sample.scale
      : 0.18 + 1.25 * sample.scale;

    item.container.setVisible(true);
    item.container.setPosition(x, y);
    item.container.setScale(scale);
    item.container.setAlpha(1);
    item.container.setDepth(4 + y / 1000);
  }

  removePassedItems() {
    const minimumDistance = this.road.getDistance() - 120;
    const visibleItems = [];

    this.items.forEach((item) => {
      if (item.distance < minimumDistance) {
        item.element.destroy();
        return;
      }

      visibleItems.push(item);
    });

    this.items = visibleItems;
  }

  createHouseOptions() {
    const types = ['cottage', 'flat'];
    const colors = [0xf1d0a5, 0xe8c7d8, 0xd7e7b8, 0xc9d9f0, 0xf0e0b6];
    const roofColors = [0x8f3f2f, 0x5d4037, 0x2f4858, 0x6d597a];

    return {
      width: Phaser.Math.Between(82, 122),
      height: Phaser.Math.Between(68, 106),
      type: types[Phaser.Math.Between(0, types.length - 1)],
      wallColor: colors[Phaser.Math.Between(0, colors.length - 1)],
      roofColor: roofColors[Phaser.Math.Between(0, roofColors.length - 1)],
      windows: Phaser.Math.Between(1, 3)
    };
  }

  createTreeOptions() {
    const types = ['round', 'pine'];
    const leafColors = [0x2f7d32, 0x3f8f3c, 0x246b2f, 0x4f9d46];

    return {
      height: Phaser.Math.Between(88, 142),
      trunkWidth: Phaser.Math.Between(12, 22),
      canopySize: Phaser.Math.Between(52, 82),
      type: types[Phaser.Math.Between(0, types.length - 1)],
      leafColor: leafColors[Phaser.Math.Between(0, leafColors.length - 1)]
    };
  }

  destroy() {
    this.items.forEach((item) => item.element.destroy());
    this.items = [];
    this.scene = null;
    this.bounds = null;
  }
}
