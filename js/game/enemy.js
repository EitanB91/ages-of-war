// Enemy class and Projectile class

class Projectile {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.dmg = config.dmg || 5;
        this.owner = config.owner || 'enemy'; // 'player' or 'enemy'
        this.type = config.type || 'stone';
        this.active = true;
        this.w = config.w || 10;
        this.h = config.h || 10;
        this.angle = config.angle || 0;
        this.lifetime = config.lifetime || 3000;
        this.timer = 0;
    }

    update(dt) {
        if (!this.active) return;

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += GRAVITY * 0.3 * dt; // slight arc

        this.timer += dt * 1000;
        if (this.timer >= this.lifetime) {
            this.active = false;
        }

        // Off-screen check
        if (this.x < -50 || this.x > CANVAS_W + 50 || this.y > CANVAS_H + 50) {
            this.active = false;
        }

        // Update angle for spears
        if (this.type === 'obSpear' || this.type === 'spear') {
            this.angle = Math.atan2(this.vy, this.vx);
        }
    }

    draw(ctx) {
        if (!this.active) return;

        switch(this.type) {
            case 'stone':
                drawProjectileStone(ctx, this.x, this.y);
                break;
            case 'slingshot':
                drawProjectileSlingshot(ctx, this.x, this.y);
                break;
            case 'advSling':
                drawProjectileAdvSlingshot(ctx, this.x, this.y);
                break;
            case 'obSpear':
                drawProjectileObsidianSpear(ctx, this.x, this.y, this.angle);
                break;
            default:
                drawProjectileStone(ctx, this.x, this.y);
                break;
        }
    }
}

class Enemy {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || GROUND_Y - (config.h || 48);
        this.vx = 0;
        this.vy = 0;
        this.w = config.w || 30;
        this.h = config.h || 48;
        this.hp = config.hp || 30;
        this.maxHp = config.hp || 30;
        this.dmg = config.dmg || 8;
        this.speed = config.speed || 60;
        this.attackRange = config.attackRange || 40;
        this.attackCooldown = config.attackCooldown || 1200;
        this.attackTimer = 0;
        this.hurtTimer = 0;
        this.hurtDuration = 300;
        this.type = config.type || 'MELEE';
        this.sublevelType = config.sublevelType || 'neanderthal';
        this.design = config.design || 0;
        this.isBoss = config.isBoss || false;

        // State: 'walk', 'attack', 'hurt', 'dead'
        this.state = 'walk';
        this.facing = config.x < CANVAS_W / 2 ? 'right' : 'left';

        this.animFrame = 0;
        this.animTimer = 0;
        this.animInterval = 200;

        this.onGround = false;

        // Position y at ground
        this.y = GROUND_Y - this.h;

        this.pendingProjectile = null;
        this.attackAnimTimer = 0;
        this.attackAnimDur = 400;
    }

    update(dt, player, projectilesArray) {
        if (this.state === 'dead') return;

        // Animation
        this.animTimer += dt * 1000;
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }

        // Hurt timer
        if (this.hurtTimer > 0) {
            this.hurtTimer -= dt * 1000;
            if (this.hurtTimer <= 0) {
                this.hurtTimer = 0;
                if (this.hp > 0) {
                    this.state = 'walk';
                }
            }
            // Slight knockback during hurt
            this.x += this.vx * dt;
            this.vx *= 0.8;
            applyGravity(this, dt);
            applyMovement(this, dt);
            groundEntity(this);
            return;
        }

        // Attack timer countdown
        if (this.attackTimer > 0) {
            this.attackTimer -= dt * 1000;
        }

        // Attack animation
        if (this.state === 'attack') {
            this.attackAnimTimer -= dt * 1000;
            if (this.attackAnimTimer <= 0) {
                this.state = 'walk';
            }
            applyGravity(this, dt);
            groundEntity(this);
            return;
        }

        // Walk state: move toward player
        if (this.state === 'walk') {
            var dx = player.x + player.w / 2 - (this.x + this.w / 2);
            var dist = Math.abs(dx);

            this.facing = dx > 0 ? 'right' : 'left';

            // Check if in attack range
            if (dist <= this.attackRange) {
                this.tryAttackPlayer(player, projectilesArray);
            } else {
                // Move toward player
                var spd = this.isBoss ? this.speed * 1.2 : this.speed;
                this.vx = (dx > 0 ? 1 : -1) * spd;
            }

            // Ranged enemies: keep distance
            if (this.type === 'RANGED' && dist < this.attackRange * 0.5) {
                this.vx = -this.vx * 0.5;
            }
        }

        // Apply physics
        applyGravity(this, dt);
        applyMovement(this, dt);
        groundEntity(this);

        // Keep on screen loosely
        if (!this.isBoss) {
            if (this.x < -100) this.x = -100;
            if (this.x + this.w > CANVAS_W + 100) this.x = CANVAS_W + 100 - this.w;
        } else {
            if (this.x < 0) { this.x = 0; this.vx = 0; }
            if (this.x + this.w > CANVAS_W) { this.x = CANVAS_W - this.w; this.vx = 0; }
        }
    }

    tryAttackPlayer(player, projectilesArray) {
        if (this.attackTimer > 0) return;

        this.attackTimer = this.attackCooldown;
        this.state = 'attack';
        this.attackAnimTimer = this.attackAnimDur;
        this.vx = 0;

        if (this.type === 'RANGED') {
            // Shoot projectile
            var proj = this.spawnProjectile(player);
            if (proj && projectilesArray) {
                projectilesArray.push(proj);
            }
        } else {
            // Melee - check if player is in range
            var dx = Math.abs(player.x + player.w / 2 - (this.x + this.w / 2));
            if (dx <= this.attackRange + 20) {
                player.takeDamage(this.dmg);
            }
        }
    }

    spawnProjectile(player) {
        var cx = this.x + this.w / 2;
        var cy = this.y + this.h * 0.4;
        var tx = player.x + player.w / 2;
        var ty = player.y + player.h * 0.4;

        var dx = tx - cx;
        var dy = ty - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var speed = 200;

        if (dist === 0) dist = 1;

        return new Projectile({
            x: cx,
            y: cy,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed - 50, // slight upward arc
            dmg: this.dmg,
            owner: 'enemy',
            type: 'stone',
            w: 10,
            h: 10
        });
    }

    takeDamage(amount) {
        if (this.state === 'dead') return false;

        this.hp -= amount;
        this.hurtTimer = this.hurtDuration;
        this.state = 'hurt';

        // Knockback
        this.vx = (this.facing === 'right' ? -1 : 1) * 150;
        this.vy = -100;

        if (this.hp <= 0) {
            this.hp = 0;
            this.state = 'dead';
            return true; // died
        }
        return false;
    }

    draw(ctx) {
        if (this.state === 'dead') return;

        // Flicker when hurt
        if (this.hurtTimer > 0 && Math.floor(this.hurtTimer / 80) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        var frame = this.animFrame;
        if (this.state === 'hurt' || this.state === 'attack') frame = 0;

        if (this.sublevelType === 'neanderthal') {
            drawEnemyNeanderthal(ctx, this.x, this.y, this.type, frame, this.facing);
        } else if (this.sublevelType === 'animal') {
            drawEnemyAnimal(ctx, this.x, this.y, this.design, frame, this.facing);
        } else if (this.sublevelType === 'dino') {
            drawEnemyDino(ctx, this.x, this.y, this.design, frame, this.facing);
        } else if (this.isBoss) {
            var phase = (this.hp / this.maxHp > 0.5) ? 1 : 2;
            drawBossTRex(ctx, this.x, this.y, frame, this.facing, phase);
        }

        ctx.globalAlpha = 1.0;

        // Draw HP bar above enemy
        this._drawHpBar(ctx);
    }

    _drawHpBar(ctx) {
        var barW = this.w;
        var barH = 4;
        var bx = this.x;
        var by = this.y - 8;
        var ratio = this.hp / this.maxHp;

        ctx.fillStyle = '#440000';
        ctx.fillRect(Math.floor(bx), Math.floor(by), barW, barH);
        ctx.fillStyle = ratio > 0.5 ? '#00CC44' : ratio > 0.25 ? '#CCAA00' : '#CC2200';
        ctx.fillRect(Math.floor(bx), Math.floor(by), Math.floor(barW * ratio), barH);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.floor(bx), Math.floor(by), barW, barH);
    }
}

// Enemy factory configs
var ENEMY_CONFIGS = {
    neanderthal_MELEE: {
        sublevelType: 'neanderthal', type: 'MELEE',
        w: 30, h: 48, hp: 30, dmg: 8, speed: 60, attackRange: 40, attackCooldown: 1200
    },
    neanderthal_RANGED: {
        sublevelType: 'neanderthal', type: 'RANGED',
        w: 30, h: 45, hp: 20, dmg: 6, speed: 50, attackRange: 200, attackCooldown: 2000
    },
    neanderthal_BULK: {
        sublevelType: 'neanderthal', type: 'BULK',
        w: 42, h: 54, hp: 90, dmg: 15, speed: 40, attackRange: 50, attackCooldown: 2000
    },
    animal_MELEE_0: {
        sublevelType: 'animal', type: 'MELEE', design: 0,
        w: 42, h: 36, hp: 35, dmg: 10, speed: 90, attackRange: 45, attackCooldown: 1000
    },
    animal_MELEE_1: {
        sublevelType: 'animal', type: 'MELEE', design: 1,
        w: 42, h: 36, hp: 35, dmg: 10, speed: 85, attackRange: 45, attackCooldown: 1000
    },
    animal_BULK_2: {
        sublevelType: 'animal', type: 'BULK', design: 2,
        w: 48, h: 39, hp: 80, dmg: 18, speed: 55, attackRange: 50, attackCooldown: 1500
    },
    dino_MELEE_0: {
        sublevelType: 'dino', type: 'MELEE', design: 0,
        w: 39, h: 45, hp: 40, dmg: 12, speed: 75, attackRange: 45, attackCooldown: 1100
    },
    dino_BULK_1: {
        sublevelType: 'dino', type: 'BULK', design: 1,
        w: 60, h: 42, hp: 100, dmg: 20, speed: 50, attackRange: 55, attackCooldown: 1600
    },
    dino_BULK_2: {
        sublevelType: 'dino', type: 'BULK', design: 2,
        w: 54, h: 36, hp: 90, dmg: 18, speed: 45, attackRange: 55, attackCooldown: 1600
    },
    boss_trex: {
        sublevelType: 'boss', type: 'BULK', isBoss: true,
        w: 84, h: 72, hp: 300, dmg: 40, speed: 65, attackRange: 90, attackCooldown: 1500
    }
};

// Item class (HP potion)
class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 18;
        this.h = 27;
        this.type = 'potion';
        this.active = true;
        this.animFrame = 0;
        this.animTimer = 0;
        this.vy = -80;
        this.onGround = false;
        this.healAmount = 25;
    }

    update(dt) {
        if (!this.active) return;

        this.animTimer += dt * 1000;
        if (this.animTimer >= 100) {
            this.animTimer = 0;
            this.animFrame++;
        }

        // Float down to ground
        if (!this.onGround) {
            this.vy += GRAVITY * dt;
            this.y += this.vy * dt;
            if (this.y + this.h >= GROUND_Y) {
                this.y = GROUND_Y - this.h;
                this.vy = 0;
                this.onGround = true;
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;
        drawHPPotion(ctx, this.x, this.y, this.animFrame);
    }
}
