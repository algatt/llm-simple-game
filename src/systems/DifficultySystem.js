export class DifficultySystem {
  constructor(options = {}) {
    this.pointsPerLevel = options.pointsPerLevel ?? 600;
    this.level = 0;
  }

  update(score) {
    const nextLevel = Math.floor(score / this.pointsPerLevel);
    const didLevelUp = nextLevel > this.level;

    this.level = nextLevel;
    return didLevelUp;
  }

  getLevel() {
    return this.level;
  }

  getDifficulty() {
    return Math.min(1, this.level / 8);
  }
}
