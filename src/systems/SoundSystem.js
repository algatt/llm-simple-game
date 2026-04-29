export class SoundSystem {
  constructor() {
    this.context = null;
    this.music = null;
    this.isUnlocked = false;
    this.musicMuted = false;
    this.musicTracks = [
      {
        title: 'Cozy Puzzle In-Game 1',
        url: 'https://opengameart.org/sites/default/files/cozy_puzzle_in-game_1_bpm118.mp3',
        source: 'https://opengameart.org/content/cozy-puzzle-in-game-1',
        license: 'CC0'
      }
    ];
  }

  create(scene) {
    scene.input.keyboard.on('keydown', () => this.unlock());
    scene.input.on('pointerdown', () => this.unlock());
  }

  unlock() {
    if (this.isUnlocked) {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    this.context = new AudioContext();
    this.startMusic();
    this.isUnlocked = true;
  }

  update(speed, isOffRoad, isPaused) {
    if (!this.music) {
      return;
    }

    this.music.volume = isPaused || this.musicMuted ? 0 : 0.24;
  }

  startMusic() {
    const track = this.musicTracks[0];

    this.music = new Audio(track.url);
    this.music.loop = true;
    this.music.volume = this.musicMuted ? 0 : 0.24;
    this.music.play().catch(() => {
      this.music = null;
    });
  }

  toggleMusicMuted() {
    this.musicMuted = !this.musicMuted;

    if (this.music) {
      this.music.volume = this.musicMuted ? 0 : 0.24;
    }
  }

  isMusicMuted() {
    return this.musicMuted;
  }

  playCrash() {
    this.playTone(95, 0.18, 'square', 0.16);
  }

  playMilestone() {
    this.playTone(660, 0.12, 'sine', 0.08);
    window.setTimeout(() => this.playTone(880, 0.12, 'sine', 0.08), 90);
  }

  playGameOver() {
    this.playTone(220, 0.2, 'sawtooth', 0.12);
    window.setTimeout(() => this.playTone(130, 0.35, 'sawtooth', 0.12), 170);
  }

  playTone(frequency, duration, type, volume) {
    if (!this.context) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.stop(this.context.currentTime + duration);
  }

  destroy() {
    if (this.music) {
      this.music.pause();
      this.music.src = '';
    }

    this.music = null;
    this.context = null;
  }
}
