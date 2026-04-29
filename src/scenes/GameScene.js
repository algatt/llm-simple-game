import Phaser from "phaser";
import { FeedbackOverlayElement } from "../elements/FeedbackOverlayElement.js";
import { GameOverElement } from "../elements/GameOverElement.js";
import { HealthHudElement } from "../elements/HealthHudElement.js";
import { MilestoneHudElement } from "../elements/MilestoneHudElement.js";
import { MusicToggleElement } from "../elements/MusicToggleElement.js";
import { PauseOverlayElement } from "../elements/PauseOverlayElement.js";
import { PlayerElement } from "../elements/PlayerElement.js";
import { RoadElement } from "../elements/RoadElement.js";
import { ScoreHudElement } from "../elements/ScoreHudElement.js";
import { SkyElement } from "../elements/SkyElement.js";
import { SpeedHudElement } from "../elements/SpeedHudElement.js";
import { TerrainElement } from "../elements/TerrainElement.js";
import { DifficultySystem } from "../systems/DifficultySystem.js";
import { HealthSystem } from "../systems/HealthSystem.js";
import { RoadGenerator } from "../systems/RoadGenerator.js";
import { ScoreSystem } from "../systems/ScoreSystem.js";
import { SceneryGenerator } from "../systems/SceneryGenerator.js";
import { SoundSystem } from "../systems/SoundSystem.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.worldElements = [];
    this.player = null;
    this.speedHud = null;
    this.scoreHud = null;
    this.healthHud = null;
    this.milestoneHud = null;
    this.musicToggle = null;
    this.pauseOverlay = null;
    this.healthSystem = new HealthSystem();
    this.scoreSystem = new ScoreSystem();
    this.difficultySystem = new DifficultySystem();
    this.soundSystem = new SoundSystem();
    this.feedbackOverlay = null;
    this.gameOverElement = null;
    this.isGameOver = false;
    this.isPaused = false;
    this.restartKey = null;
    this.pauseKey = null;
    this.roadGenerator = null;
    this.terrain = null;
  }

  create() {
    const { width, height } = this.scale;
    const horizonY = height / 2;

    this.healthSystem = new HealthSystem();
    this.scoreSystem = new ScoreSystem();
    this.difficultySystem = new DifficultySystem();
    this.soundSystem = new SoundSystem();
    this.isGameOver = false;
    this.isPaused = false;
    this.restartKey = this.input.keyboard.addKey("R");
    this.pauseKey = this.input.keyboard.addKey("P");
    this.soundSystem.create(this);

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
    this.roadGenerator = roadGenerator;
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

    this.musicToggle = new MusicToggleElement();
    this.musicToggle.create(this, {
      x: 0,
      y: 0,
      width,
      height: horizonY,
    }, this.soundSystem);

    this.milestoneHud = new MilestoneHudElement();
    this.milestoneHud.create(this, {
      width,
      height,
    });

    this.pauseOverlay = new PauseOverlayElement();
    this.pauseOverlay.create(this, {
      width,
      height,
    });

    this.feedbackOverlay = new FeedbackOverlayElement();
    this.feedbackOverlay.create(this, {
      width,
      height,
    });

    this.worldElements = [sky, terrain];
  }

  update(time, delta) {
    if (this.isGameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.scene.restart();
      }

      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause();
    }

    if (this.isPaused) {
      this.soundSystem.update(0, false, true);
      return;
    }

    this.player?.update(delta);
    const isOffRoad = this.isPlayerOffRoad();

    if (isOffRoad) {
      this.player?.applyOffRoadFriction(delta, 1.8);
    }

    const speed = this.player?.getSpeed() ?? 0;

    this.scoreSystem.update(delta, speed);
    this.updateDifficulty();
    this.worldElements.forEach((element) => {
      element.update?.(delta, speed);
    });
    this.speedHud?.update(speed);
    this.scoreHud?.update(this.scoreSystem.getScore());
    this.musicToggle?.update();
    this.checkSceneryCollisions(speed);
    this.healthHud?.update(this.healthSystem.getHealth());
    this.milestoneHud?.update();
    this.feedbackOverlay?.update(isOffRoad, speed);
    this.soundSystem.update(speed, isOffRoad, false);

    if (this.healthSystem.isDepleted()) {
      this.endGame();
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseOverlay?.setPaused(this.isPaused);
  }

  updateDifficulty() {
    const score = this.scoreSystem.getScore();
    const didLevelUp = this.difficultySystem.update(score);
    const difficulty = this.difficultySystem.getDifficulty();

    this.roadGenerator?.setDifficulty(difficulty);
    this.terrain?.getScenery()?.setDifficulty(difficulty);

    if (didLevelUp && score > 0) {
      this.milestoneHud?.show(`MILESTONE ${score}`);
      this.soundSystem.playMilestone();
    }
  }

  isPlayerOffRoad() {
    const playerPosition = this.player?.getPosition();
    const road = this.terrain?.getRoad();

    if (!playerPosition || !road) {
      return false;
    }

    return !road.isPointOnRoad(playerPosition.x, playerPosition.y);
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
      this.player?.crashStop();
      this.player?.wobble();
      this.healthHud?.pulse();
      this.feedbackOverlay?.crashFlash();
      this.soundSystem.playCrash();
      this.cameras.main.shake(170, 0.012);
      scenery.markCollided(item);
    });
  }

  endGame() {
    this.isGameOver = true;
    const score = this.scoreSystem.getScore();
    const bestScore = this.saveBestScore(score);

    this.soundSystem.update(0, false, true);
    this.soundSystem.playGameOver();
    this.gameOverElement = new GameOverElement();
    this.gameOverElement.create(this, {
      width: this.scale.width,
      height: this.scale.height,
    }, score, bestScore);
  }

  saveBestScore(score) {
    const storageKey = "robert-game-best-score";

    try {
      const previousBest = Number(window.localStorage.getItem(storageKey) ?? 0);
      const bestScore = Math.max(previousBest, score);

      window.localStorage.setItem(storageKey, String(bestScore));
      return bestScore;
    } catch {
      return score;
    }
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
    this.milestoneHud?.destroy();
    this.milestoneHud = null;
    this.musicToggle?.destroy();
    this.musicToggle = null;
    this.pauseOverlay?.destroy();
    this.pauseOverlay = null;
    this.feedbackOverlay?.destroy();
    this.feedbackOverlay = null;
    this.soundSystem?.destroy();
    this.gameOverElement?.destroy();
    this.gameOverElement = null;
    this.restartKey = null;
    this.pauseKey = null;
    this.roadGenerator = null;
    this.terrain = null;
  }
}
