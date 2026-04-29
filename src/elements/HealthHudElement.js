export class HealthHudElement {
  constructor(options = {}) {
    this.label = options.label ?? 'HEALTH';
    this.maxHealth = options.maxHealth ?? 10;
    this.text = null;
    this.bar = null;
    this.fill = null;
    this.pulseFrames = 0;
  }

  create(scene, bounds) {
    const x = bounds.x + bounds.width - 164;
    const y = bounds.y + 18;

    this.text = scene.add.text(x, y, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#f5f7fb'
    }).setOrigin(0, 0);

    this.bar = scene.add.rectangle(x, y + 30, 128, 14, 0x10151c)
      .setOrigin(0, 0);
    this.fill = scene.add.rectangle(x + 2, y + 32, 124, 10, 0x4ade80)
      .setOrigin(0, 0);

    [this.text, this.bar, this.fill].forEach((object) => object.setDepth(20));
  }

  update(health) {
    const ratio = Math.max(0, Math.min(1, health / this.maxHealth));

    this.text?.setText(`${this.label}: ${health.toFixed(1)}`);

    if (this.fill) {
      this.fill.width = 124 * ratio;
      this.fill.setFillStyle(ratio > 0.45 ? 0x4ade80 : 0xef4444);
    }

    if (this.pulseFrames > 0) {
      this.pulseFrames -= 1;
      this.text?.setColor('#ef4444');
      this.fill?.setScale(1, 1.4);
      return;
    }

    this.text?.setColor('#f5f7fb');
    this.fill?.setScale(1, 1);
  }

  pulse() {
    this.pulseFrames = 12;
  }

  destroy() {
    this.text?.destroy();
    this.bar?.destroy();
    this.fill?.destroy();
    this.text = null;
    this.bar = null;
    this.fill = null;
  }
}
