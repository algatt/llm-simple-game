export class FeedbackOverlayElement {
  constructor() {
    this.warning = null;
    this.flash = null;
  }

  create(scene, bounds) {
    this.warning = scene.add.rectangle(0, 0, bounds.width, bounds.height, 0xef4444, 0)
      .setOrigin(0, 0)
      .setDepth(30);
    this.flash = scene.add.rectangle(0, 0, bounds.width, bounds.height, 0xffffff, 0)
      .setOrigin(0, 0)
      .setDepth(31);
  }

  update(isOffRoad, speed) {
    if (!this.warning) {
      return;
    }

    const targetAlpha = isOffRoad ? Math.min(0.22, 0.06 + speed * 0.012) : 0;
    this.warning.alpha += (targetAlpha - this.warning.alpha) * 0.16;

    if (this.flash && this.flash.alpha > 0) {
      this.flash.alpha *= 0.82;
    }
  }

  crashFlash() {
    if (this.flash) {
      this.flash.alpha = 0.5;
    }
  }

  destroy() {
    this.warning?.destroy();
    this.flash?.destroy();
    this.warning = null;
    this.flash = null;
  }
}
