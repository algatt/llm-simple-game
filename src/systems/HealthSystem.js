import Phaser from 'phaser';

export class HealthSystem {
  constructor(options = {}) {
    this.health = options.health ?? 10;
    this.maxHealth = options.maxHealth ?? 10;
    this.minHealth = options.minHealth ?? 0;
    this.damageMultiplier = options.damageMultiplier ?? 0.35;
  }

  damageForSpeed(speed) {
    return Phaser.Math.Clamp(speed * this.damageMultiplier, 0.5, 4);
  }

  applyDamage(amount) {
    this.health = Phaser.Math.Clamp(this.health - amount, this.minHealth, this.maxHealth);
    return this.health;
  }

  getHealth() {
    return this.health;
  }

  isDepleted() {
    return this.health <= this.minHealth;
  }
}
