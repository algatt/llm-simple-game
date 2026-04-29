import Phaser from "phaser";
import { GameOverElement } from "../elements/GameOverElement.js";
import { HealthHudElement } from "../elements/HealthHudElement.js";
import { PlayerElement } from "../elements/PlayerElement.js";
import { RoadElement } from "../elements/RoadElement.js";
import { ScoreHudElement } from "../elements/ScoreHudElement.js";
import { SkyElement } from "../elements/SkyElement.js";
import { SpeedHudElement } from "../elements/SpeedHudElement.js";
import { TerrainElement } from "../elements/TerrainElement.js";
import { HealthSystem } from "../systems/HealthSystem.js";
import { RoadGenerator } from "../systems/RoadGenerator.js";
import { ScoreSystem } from "../systems/ScoreSystem.js";
import { SceneryGenerator } from "../systems/SceneryGenerator.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.worldElements = [];
    this.player = null;
    this.speedHud = null;
    this.scoreHud = null;
    this.healthHud = null;
    this.healthSystem = new HealthSystem();
    this.scoreSystem = new ScoreSystem();
    this.gameOverElement = null;
    this.isGameOver = false;
    this.terrain = null;
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
    const scenery = new SceneryGenerator({
      road,
      interval: { min: 260, max: 520 },
      treeInterval: { min: 110, max: 260 },
      sideOffset: 145,
      treeSideOffset: 220,
      houseDistance: 980,
    });
    const terrain = new TerrainElement({ road, scenery });
    this.terrain = terrain;
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

    this.scoreHud = new ScoreHudElement();
    this.scoreHud.create(this, {
      x: 0,
      y: 0,
      width,
      height: horizonY,
    });
    this.scoreHud.update(this.scoreSystem.getScore());

    this.healthHud = new HealthHudElement();
    this.healthHud.create(this, {
      x: 0,
      y: 0,
      width,
      height: horizonY,
    });
    this.healthHud.update(this.healthSystem.getHealth());

    this.worldElements = [sky, terrain];
  }

  update(time, delta) {
    if (this.isGameOver) {
      return;
    }

    this.player?.update(delta);
    const speed = this.player?.getSpeed() ?? 0;

    this.scoreSystem.update(delta, speed);
    this.worldElements.forEach((element) => {
      element.update?.(delta, speed);
    });
    this.speedHud?.update(speed);
    this.scoreHud?.update(this.scoreSystem.getScore());
    this.checkSceneryCollisions(speed);
    this.healthHud?.update(this.healthSystem.getHealth());

    if (this.healthSystem.isDepleted()) {
      this.endGame();
    }
  }

  checkSceneryCollisions(speed) {
    const playerPosition = this.player?.getPosition();
    const playerBounds = this.player?.getBounds();
    const road = this.terrain?.getRoad();
    const scenery = this.terrain?.getScenery();

    if (!playerPosition || !playerBounds || !road || !scenery) {
      return;
    }

    if (road.isPointOnRoad(playerPosition.x, playerPosition.y)) {
      return;
    }

    scenery.getCollisionItems().forEach(({ item, bounds }) => {
      if (!Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, bounds)) {
        return;
      }

      const damage = this.healthSystem.damageForSpeed(speed);

      this.healthSystem.applyDamage(damage);
      scenery.markCollided(item);
    });
  }

  endGame() {
    this.isGameOver = true;
    this.gameOverElement = new GameOverElement();
    this.gameOverElement.create(this, {
      width: this.scale.width,
      height: this.scale.height,
    }, this.scoreSystem.getScore());
  }

  shutdown() {
    this.worldElements.forEach((element) => element.destroy());
    this.worldElements = [];
    this.player?.destroy();
    this.player = null;
    this.speedHud?.destroy();
    this.speedHud = null;
    this.scoreHud?.destroy();
    this.scoreHud = null;
    this.healthHud?.destroy();
    this.healthHud = null;
    this.gameOverElement?.destroy();
    this.gameOverElement = null;
    this.terrain = null;
  }
}
