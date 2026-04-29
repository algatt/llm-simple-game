import Phaser from 'phaser';

export class PlayerElement {
  constructor(options = {}) {
    this.width = options.width ?? 58;
    this.height = options.height ?? 52;
    this.lateralSpeed = options.lateralSpeed ?? 260;
    this.speed = options.speed ?? 1;
    this.minSpeed = options.minSpeed ?? 0;
    this.maxSpeed = options.maxSpeed ?? 10;
    this.acceleration = options.acceleration ?? 3;
    this.braking = options.braking ?? 4;
    this.color = options.color ?? 0x2dd4bf;
    this.boundsPadding = options.boundsPadding ?? 24;
    this.body = null;
    this.hitbox = null;
    this.wheels = [];
    this.keys = null;
    this.bounds = null;
  }

  create(scene, bounds) {
    this.bounds = bounds;
    this.body = scene.add.container(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height - 70
    );

    this.body.setDepth(10);
    this.createBikeVisual(scene);

    this.hitbox = scene.add.rectangle(this.body.x, this.body.y - 18, this.width, this.height, 0xffffff, 0);
    this.hitbox.setDepth(9);

    this.keys = scene.input.keyboard.addKeys({
      left: 'A',
      right: 'D',
      accelerate: 'W',
      brake: 'S'
    });
  }

  update(delta) {
    if (!this.body || !this.keys) {
      return;
    }

    const dt = delta / 1000;
    const direction = Number(this.keys.right.isDown) - Number(this.keys.left.isDown);
    const speedInput = Number(this.keys.accelerate.isDown) - Number(this.keys.brake.isDown);
    const speedChange = speedInput >= 0 ? this.acceleration : this.braking;
    const nextSpeed = this.speed + speedInput * speedChange * dt;
    const nextX = this.body.x + direction * this.lateralSpeed * dt;
    const minX = this.bounds.x + this.boundsPadding + this.width / 2;
    const maxX = this.bounds.x + this.bounds.width - this.boundsPadding - this.width / 2;

    this.speed = Phaser.Math.Clamp(nextSpeed, this.minSpeed, this.maxSpeed);
    this.body.x = Phaser.Math.Clamp(nextX, minX, maxX);
    this.body.rotation = Phaser.Math.Linear(this.body.rotation, direction * 0.16, 0.18);
    this.wheels.forEach((wheel) => {
      wheel.y = Math.sin(this.speed * this.body.scene.time.now * 0.008) * 1.4;
    });

    this.hitbox.setPosition(this.body.x, this.body.y - 18);
  }

  createBikeVisual(scene) {
    const rearWheel = this.createRearWheel(scene, 0, 0);
    const frame = scene.add.graphics();

    frame.lineStyle(4, this.color, 1);
    frame.beginPath();
    frame.moveTo(0, 0);
    frame.lineTo(-18, -25);
    frame.lineTo(0, -36);
    frame.lineTo(18, -25);
    frame.lineTo(0, 0);
    frame.moveTo(-26, -28);
    frame.lineTo(26, -28);
    frame.strokePath();

    const torso = scene.add.rectangle(0, -48, 24, 32, 0xf97316)
      .setOrigin(0.5);
    const shoulders = scene.add.rectangle(0, -61, 38, 8, 0xea580c)
      .setOrigin(0.5);
    const head = scene.add.circle(0, -80, 10, 0xffd7b5);
    const helmet = scene.add.arc(0, -84, 11, 180, 360, false, 0x1e293b)
      .setOrigin(0.5);
    const leftArm = scene.add.line(0, 0, -13, -56, -26, -30, 0xffd7b5)
      .setOrigin(0, 0)
      .setLineWidth(5);
    const rightArm = scene.add.line(0, 0, 13, -56, 26, -30, 0xffd7b5)
      .setOrigin(0, 0)
      .setLineWidth(5);
    const seat = scene.add.ellipse(0, -34, 22, 8, 0x1e293b);

    this.wheels = [rearWheel];
    this.body.add([
      rearWheel,
      frame,
      leftArm,
      rightArm,
      torso,
      shoulders,
      seat,
      head,
      helmet
    ]);
  }

  createRearWheel(scene, x, y) {
    const wheel = scene.add.container(x, y);
    const tire = scene.add.rectangle(0, 0, 10, 38, 0x10151c)
      .setOrigin(0.5);
    const rim = scene.add.rectangle(0, 0, 4, 28, 0xdbeafe)
      .setOrigin(0.5);
    const treadTop = scene.add.rectangle(0, -11, 12, 3, 0x334155)
      .setOrigin(0.5);
    const treadBottom = scene.add.rectangle(0, 11, 12, 3, 0x334155)
      .setOrigin(0.5);
    const hub = scene.add.circle(0, 0, 3, 0x475569);

    wheel.add([tire, rim, treadTop, treadBottom, hub]);
    return wheel;
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed) {
    this.speed = Phaser.Math.Clamp(speed, this.minSpeed, this.maxSpeed);
  }

  crashStop() {
    this.speed = 0;
  }

  getBounds() {
    return this.hitbox?.getBounds() ?? null;
  }

  getPosition() {
    if (!this.body) {
      return null;
    }

    return {
      x: this.body.x,
      y: this.body.y
    };
  }

  destroy() {
    this.body?.destroy();
    this.hitbox?.destroy();
    this.body = null;
    this.hitbox = null;
    this.wheels = [];
    this.keys = null;
    this.bounds = null;
  }
}
