import Phaser from 'phaser';

export class PlayerElement {
  constructor(options = {}) {
    this.size = options.size ?? 36;
    this.lateralSpeed = options.lateralSpeed ?? 260;
    this.speed = options.speed ?? 1;
    this.minSpeed = options.minSpeed ?? 1;
    this.maxSpeed = options.maxSpeed ?? 10;
    this.acceleration = options.acceleration ?? 3;
    this.braking = options.braking ?? 4;
    this.color = options.color ?? 0x2dd4bf;
    this.boundsPadding = options.boundsPadding ?? 24;
    this.body = null;
    this.keys = null;
    this.bounds = null;
  }

  create(scene, bounds) {
    this.bounds = bounds;
    this.body = scene.add.rectangle(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height - 72,
      this.size,
      this.size,
      this.color
    );

    this.body.setDepth(10);
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
    const minX = this.bounds.x + this.boundsPadding + this.size / 2;
    const maxX = this.bounds.x + this.bounds.width - this.boundsPadding - this.size / 2;

    this.speed = Phaser.Math.Clamp(nextSpeed, this.minSpeed, this.maxSpeed);
    this.body.x = Phaser.Math.Clamp(nextX, minX, maxX);
  }

  getSpeed() {
    return this.speed;
  }

  destroy() {
    this.body?.destroy();
    this.body = null;
    this.keys = null;
    this.bounds = null;
  }
}
