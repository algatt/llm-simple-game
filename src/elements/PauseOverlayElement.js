export class PauseOverlayElement {
  constructor() {
    this.container = null;
  }

  create(scene, bounds) {
    this.container = scene.add.container(bounds.width / 2, bounds.height / 2);
    this.container.setDepth(35);

    const panel = scene.add.rectangle(0, 0, 280, 116, 0x10151c, 0.9);
    const title = scene.add.text(0, -24, 'PAUSED', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      color: '#f5f7fb'
    }).setOrigin(0.5);
    const hint = scene.add.text(0, 24, 'Press P to resume', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#b9c4d0'
    }).setOrigin(0.5);

    this.container.add([panel, title, hint]);
    this.container.setVisible(false);
  }

  setPaused(isPaused) {
    this.container?.setVisible(isPaused);
  }

  destroy() {
    this.container?.destroy();
    this.container = null;
  }
}
