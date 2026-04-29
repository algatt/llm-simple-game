export class GameOverElement {
  constructor() {
    this.container = null;
  }

  create(scene, bounds, score) {
    this.container = scene.add.container(bounds.width / 2, bounds.height / 2);
    this.container.setDepth(40);

    const panel = scene.add.rectangle(0, 0, 360, 180, 0x10151c, 0.92);
    const title = scene.add.text(0, -52, 'GAME OVER', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '38px',
      color: '#f5f7fb'
    }).setOrigin(0.5);
    const points = scene.add.text(0, 4, `POINTS: ${score}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#f6d365'
    }).setOrigin(0.5);
    const hint = scene.add.text(0, 54, 'Refresh to try again', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#b9c4d0'
    }).setOrigin(0.5);

    this.container.add([panel, title, points, hint]);
  }

  destroy() {
    this.container?.destroy();
    this.container = null;
  }
}
