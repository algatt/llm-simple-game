export class ScoreHudElement {
  constructor(options = {}) {
    this.label = options.label ?? 'POINTS';
    this.text = null;
  }

  create(scene, bounds) {
    this.text = scene.add.text(bounds.x + 24, bounds.y + 18, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '22px',
      color: '#f5f7fb',
      backgroundColor: '#10151c',
      padding: {
        x: 12,
        y: 7
      }
    }).setOrigin(0, 0);

    this.text.setDepth(20);
  }

  update(score) {
    this.text?.setText(`${this.label}: ${score}`);
  }

  destroy() {
    this.text?.destroy();
    this.text = null;
  }
}
