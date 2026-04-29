import Phaser from 'phaser';

export class RoadGenerator {
  constructor(options = {}) {
    this.lookAheadBuffer = options.lookAheadBuffer ?? 1200;
    this.maxOffset = options.maxOffset ?? 210;
    this.straightLength = options.straightLength ?? { min: 950, max: 1450 };
    this.turnLength = options.turnLength ?? { min: 260, max: 380 };
    this.turnAmount = options.turnAmount ?? { min: 150, max: 235 };
    this.straightJitter = options.straightJitter ?? 8;
    this.nextSection = 'straight';
    this.difficulty = 0;
    this.anchors = [
      { distance: 0, offset: 0 },
      { distance: 900, offset: 0 }
    ];
  }

  getOffset(distance) {
    this.ensureAnchors(distance + this.lookAheadBuffer);

    const nextIndex = this.anchors.findIndex((anchor) => anchor.distance >= distance);
    const end = this.anchors[Math.max(nextIndex, 1)];
    const start = this.anchors[this.anchors.indexOf(end) - 1];
    const progress = Phaser.Math.Clamp(
      (distance - start.distance) / (end.distance - start.distance),
      0,
      1
    );
    const eased = this.smoothStep(progress);

    return Phaser.Math.Linear(start.offset, end.offset, eased);
  }

  ensureAnchors(distance) {
    while (this.anchors.at(-1).distance < distance) {
      this.anchors.push(this.createNextAnchor());
    }

    if (this.anchors.length > 12) {
      this.anchors.splice(0, this.anchors.length - 12);
    }
  }

  createNextAnchor() {
    const last = this.anchors.at(-1);

    if (this.nextSection === 'turn') {
      this.nextSection = 'straight';

      return {
        distance: last.distance + this.randomBetween(this.turnLength),
        offset: this.pickTurnOffset(last.offset)
      };
    }

    this.nextSection = 'turn';

    return {
      distance: last.distance + this.randomBetween(this.straightLength),
      offset: this.pickStraightOffset(last.offset)
    };
  }

  pickStraightOffset(currentOffset) {
    return Phaser.Math.Clamp(
      currentOffset + Phaser.Math.Between(-this.straightJitter, this.straightJitter),
      -this.maxOffset,
      this.maxOffset
    );
  }

  pickTurnOffset(currentOffset) {
    const currentDirection = Math.sign(currentOffset);
    const turnDirection = currentDirection === 0
      ? (Math.random() < 0.5 ? -1 : 1)
      : -currentDirection;
    const amount = this.randomBetween(this.turnAmount);

    return Phaser.Math.Clamp(
      currentOffset + turnDirection * amount,
      -this.maxOffset,
      this.maxOffset
    );
  }

  randomBetween(range) {
    return Phaser.Math.Between(range.min, range.max);
  }

  setDifficulty(difficulty) {
    this.difficulty = Phaser.Math.Clamp(difficulty, 0, 1);
    this.maxOffset = 210 + 85 * this.difficulty;
    this.straightLength = {
      min: Math.round(950 - 260 * this.difficulty),
      max: Math.round(1450 - 360 * this.difficulty)
    };
    this.turnLength = {
      min: Math.round(260 - 70 * this.difficulty),
      max: Math.round(380 - 80 * this.difficulty)
    };
    this.turnAmount = {
      min: Math.round(150 + 60 * this.difficulty),
      max: Math.round(235 + 80 * this.difficulty)
    };
    this.straightJitter = Math.round(8 + 10 * this.difficulty);
  }

  smoothStep(progress) {
    return progress * progress * (3 - 2 * progress);
  }
}
