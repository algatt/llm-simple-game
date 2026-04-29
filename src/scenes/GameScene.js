import Phaser from "phaser";
import { PlayerElement } from "../elements/PlayerElement.js";
import { RoadElement } from "../elements/RoadElement.js";
import { SkyElement } from "../elements/SkyElement.js";
import { TerrainElement } from "../elements/TerrainElement.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.worldElements = [];
    this.player = null;
  }

  create() {
    const { width, height } = this.scale;
    const horizonY = height / 2;

    const sky = new SkyElement();
    sky.create(this, {
      x: 0,
      y: 0,
      width,
      height: horizonY,
    });

    const road = new RoadElement({
      curveX: 140,
      curveStrength: 1.7,
      segments: 28,
    });
    const terrain = new TerrainElement({ road });
    terrain.create(this, {
      x: 0,
      y: horizonY,
      width,
      height: height - horizonY,
    });

    this.player = new PlayerElement();
    this.player.create(this, {
      x: 0,
      y: horizonY,
      width,
      height: height - horizonY,
    });

    this.worldElements = [sky, terrain];
  }

  update(time, delta) {
    this.player?.update(delta);
  }

  shutdown() {
    this.worldElements.forEach((element) => element.destroy());
    this.worldElements = [];
    this.player?.destroy();
    this.player = null;
  }
}
