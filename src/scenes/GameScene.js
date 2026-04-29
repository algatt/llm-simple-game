import Phaser from "phaser";
import { PlayerElement } from "../elements/PlayerElement.js";
import { RoadElement } from "../elements/RoadElement.js";
import { SkyElement } from "../elements/SkyElement.js";
import { SpeedHudElement } from "../elements/SpeedHudElement.js";
import { TerrainElement } from "../elements/TerrainElement.js";
import { RoadGenerator } from "../systems/RoadGenerator.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.worldElements = [];
    this.player = null;
    this.speedHud = null;
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

    const roadGenerator = new RoadGenerator({
      maxOffset: 210,
      straightLength: { min: 950, max: 1450 },
      turnLength: { min: 260, max: 380 },
      turnAmount: { min: 150, max: 235 },
      straightJitter: 8,
    });
    const road = new RoadElement({
      generator: roadGenerator,
      curveStrength: 1.8,
      lookAhead: 780,
      segments: 32,
      worldSpeedMultiplier: 42,
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

    this.speedHud = new SpeedHudElement();
    this.speedHud.create(this, {
      x: 0,
      y: 0,
      width,
      height: horizonY,
    });
    this.speedHud.update(this.player.getSpeed());

    this.worldElements = [sky, terrain];
  }

  update(time, delta) {
    this.player?.update(delta);
    const speed = this.player?.getSpeed() ?? 0;

    this.worldElements.forEach((element) => {
      element.update?.(delta, speed);
    });
    this.speedHud?.update(speed);
  }

  shutdown() {
    this.worldElements.forEach((element) => element.destroy());
    this.worldElements = [];
    this.player?.destroy();
    this.player = null;
    this.speedHud?.destroy();
    this.speedHud = null;
  }
}
