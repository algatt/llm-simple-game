export class ScoreSystem {
  constructor(options = {}) {
    this.score = options.score ?? 0;
    this.pointsPerSpeedSecond = options.pointsPerSpeedSecond ?? 10;
  }

  update(delta, speed) {
    this.score += speed * this.pointsPerSpeedSecond * (delta / 1000);
  }

  getScore() {
    return Math.floor(this.score);
  }

  reset() {
    this.score = 0;
  }
}
