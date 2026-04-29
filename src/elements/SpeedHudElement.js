export class SpeedHudElement {
  constructor(options = {}) {
    this.label = options.label ?? 'SPEED';
    this.text = null;
  }

  create(scene, bounds) {
    this.text = scene.add.text(bounds.x + bounds.width / 2, bounds.y + 18, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '22px',
      color: '#f5f7fb',
      backgroundColor: '#10151c',
      padding: {
        x: 12,
        y: 7
      }
    }).setOrigin(0.5, 0);

    this.text.setDepth(20);
  }

  update(speed) {
    this.text?.setText(`${this.label}: ${speed.toFixed(1)}`);
  }

  destroy() {
    this.text?.destroy();
    this.text = null;
  }
}
