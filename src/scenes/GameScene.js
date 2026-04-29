import Phaser from 'phaser';
import { SkyElement } from '../elements/SkyElement.js';
import { TerrainElement } from '../elements/TerrainElement.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.worldElements = [];
  }

  create() {
    const { width, height } = this.scale;
    const horizonY = height / 2;

    const sky = new SkyElement();
    sky.create(this, {
      x: 0,
      y: 0,
      width,
      height: horizonY
    });

    const terrain = new TerrainElement();
    terrain.create(this, {
      x: 0,
      y: horizonY,
      width,
      height: height - horizonY
    });

    this.worldElements = [sky, terrain];
  }

  shutdown() {
    this.worldElements.forEach((element) => element.destroy());
    this.worldElements = [];
  }
}
