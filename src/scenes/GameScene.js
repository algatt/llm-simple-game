import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, 80, 'Robert Game', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '40px',
      color: '#f5f7fb'
    }).setOrigin(0.5);

    this.add.text(width / 2, 132, 'Phaser is running', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#b9c4d0'
    }).setOrigin(0.5);

    this.player = this.add.rectangle(width / 2, height / 2, 48, 48, 0x4ade80);
    this.playerVelocity = new Phaser.Math.Vector2(140, 95);
  }

  update(time, delta) {
    const dt = delta / 1000;
    const bounds = this.player.getBounds();
    const { width, height } = this.scale;

    this.player.x += this.playerVelocity.x * dt;
    this.player.y += this.playerVelocity.y * dt;
    this.player.rotation += 1.6 * dt;

    if (bounds.left <= 0 || bounds.right >= width) {
      this.playerVelocity.x *= -1;
    }

    if (bounds.top <= 0 || bounds.bottom >= height) {
      this.playerVelocity.y *= -1;
    }
  }
}
