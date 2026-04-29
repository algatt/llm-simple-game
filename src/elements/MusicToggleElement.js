export class MusicToggleElement {
  constructor(options = {}) {
    this.label = options.label ?? 'MUSIC';
    this.button = null;
    this.soundSystem = null;
  }

  create(scene, bounds, soundSystem) {
    this.soundSystem = soundSystem;
    this.button = scene.add.text(bounds.x + bounds.width - 164, bounds.y + 66, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#f5f7fb',
      backgroundColor: '#10151c',
      padding: {
        x: 10,
        y: 6
      }
    }).setOrigin(0, 0);

    this.button.setDepth(21);
    this.button.setInteractive({ useHandCursor: true });
    this.button.on('pointerdown', () => {
      this.soundSystem?.toggleMusicMuted();
      this.update();
    });
    this.update();
  }

  update() {
    const state = this.soundSystem?.isMusicMuted() ? 'OFF' : 'ON';

    this.button?.setText(`${this.label}: ${state}`);
  }

  destroy() {
    this.button?.destroy();
    this.button = null;
    this.soundSystem = null;
  }
}
