export class MilestoneHudElement {
  constructor() {
    this.text = null;
    this.frames = 0;
  }

  create(scene, bounds) {
    this.text = scene.add.text(bounds.width / 2, 68, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#f6d365',
      backgroundColor: '#10151c',
      padding: {
        x: 14,
        y: 8
      }
    }).setOrigin(0.5, 0);

    this.text.setDepth(22);
    this.text.setVisible(false);
  }

  show(message) {
    if (!this.text) {
      return;
    }

    this.text.setText(message);
    this.text.setVisible(true);
    this.text.setAlpha(1);
    this.frames = 110;
  }

  update() {
    if (!this.text || this.frames <= 0) {
      return;
    }

    this.frames -= 1;
    this.text.setAlpha(Math.min(1, this.frames / 25));

    if (this.frames <= 0) {
      this.text.setVisible(false);
    }
  }

  destroy() {
    this.text?.destroy();
    this.text = null;
  }
}
