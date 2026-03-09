// Player class

class Player {
    constructor() {
        this.x = CANVAS_W / 2 - 18;
        this.y = GROUND_Y - 54;
        this.vx = 0;
        this.vy = 0;
        this.w = 36;
        this.h = 54;

        this.hp = 80;
        this.maxHp = 80;
        this.lives = 3;

        this.charLevel = 0;
        this.meleeWeapon = 'stick';
        this.rangedWeapon = 'stones';

        this.meleeCooldownTimer = 0;
        this.rangedCooldownTimer = 0;

        this.attackTimer = 0;
        this.attackType = null;

        this.hurtTimer = 0;
        this.invincibleTimer = 0;

        this.onGround = false;
        this.facing = 'right';

        // State: 'idle', 'walk', 'jump', 'attack', 'hurt', 'dead'
        this.state = 'idle';

        this.animFrame = 0;
        this.animTimer = 0;
        this.animInterval = 150;

        this.score = 0;
        this.kills = 0;
    }

    update(dt, inputRef, enemies, projectiles, items) {
        if (this.state === 'dead') return;

        // Update timers
        if (this.meleeCooldownTimer > 0) this.meleeCooldownTimer -= dt * 1000;
        if (this.rangedCooldownTimer > 0) this.rangedCooldownTimer -= dt * 1000;
        if (this.invincibleTimer > 0) this.invincibleTimer -= dt * 1000;
        if (this.hurtTimer > 0) {
            this.hurtTimer -= dt * 1000;
            if (this.hurtTimer <= 0) {
                this.hurtTimer = 0;
                if (this.state === 'hurt') this.state = 'idle';
            }
        }
        if (this.attackTimer > 0) {
            this.attackTimer -= dt * 1000;
            if (this.attackTimer <= 0) {
                this.attackTimer = 0;
                if (this.state === 'attack') this.state = 'idle';
            }
        }

        // Input handling (only when not in hurt/attack states)
        var moving = false;
        if (this.state !== 'hurt') {
            if (inputRef.isDown('left')) {
                this.vx = -PLAYER_SPEED;
                this.facing = 'left';
                moving = true;
            } else if (inputRef.isDown('right')) {
                this.vx = PLAYER_SPEED;
                this.facing = 'right';
                moving = true;
            } else {
                this.vx *= 0.7; // friction
                if (Math.abs(this.vx) < 5) this.vx = 0;
            }

            // Jump
            if (inputRef.justPressed('jump') && this.onGround) {
                this.vy = JUMP_FORCE;
                this.onGround = false;
                this.state = 'jump';
                audio.sfx.jump();
            }

            // Melee attack
            if (inputRef.justPressed('melee')) {
                this.tryMeleeAttack(enemies);
            }

            // Ranged attack
            if (inputRef.justPressed('ranged')) {
                var proj = this.tryRangedAttack();
                if (proj) {
                    projectiles.push(proj);
                }
            }
        }

        // Apply physics
        applyGravity(this, dt);
        applyMovement(this, dt);
        groundEntity(this);
        clampToScreen(this);

        // State update
        if (this.state !== 'hurt' && this.state !== 'attack' && this.state !== 'dead') {
            if (!this.onGround) {
                this.state = 'jump';
            } else if (moving) {
                this.state = 'walk';
            } else {
                this.state = 'idle';
            }
        }

        // Animation
        this.animTimer += dt * 1000;
        if (this.animTimer >= this.animInterval) {
            this.animTimer = 0;
            if (this.state === 'walk') {
                this.animFrame = (this.animFrame + 1) % 4;
            } else {
                this.animFrame = 0;
            }
        }

        // Check item pickups
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (!item.active) continue;
                if (checkAABB(this, item)) {
                    this._collectItem(item);
                }
            }
        }

        // Check enemy projectile hits
        if (projectiles) {
            for (var pi = 0; pi < projectiles.length; pi++) {
                var p = projectiles[pi];
                if (!p.active || p.owner !== 'enemy') continue;
                if (checkAABB(this, p)) {
                    p.active = false;
                    this.takeDamage(p.dmg);
                }
            }
        }
    }

    tryMeleeAttack(enemies) {
        if (this.meleeCooldownTimer > 0) return;

        var weapon = WEAPONS[this.meleeWeapon];
        if (!weapon || weapon.type !== 'melee') return;

        this.meleeCooldownTimer = weapon.cooldown;
        this.attackTimer = 300;
        this.state = 'attack';
        audio.sfx.meleeHit();

        // Hit area in front of player
        var attackX = this.facing === 'right'
            ? this.x + this.w
            : this.x - weapon.range;

        var hitBox = {
            x: attackX,
            y: this.y + 10,
            w: weapon.range,
            h: this.h - 20
        };

        // Check enemies in range
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (e.state === 'dead') continue;
            if (checkAABB(hitBox, e)) {
                var killed = e.takeDamage(weapon.dmg);
                if (killed) {
                    audio.sfx.enemyDie();
                    // Notify gameState
                    if (typeof onEnemyKilled === 'function') {
                        onEnemyKilled(e);
                    }
                }
            }
        }
    }

    tryRangedAttack() {
        if (this.rangedCooldownTimer > 0) return null;

        var weapon = WEAPONS[this.rangedWeapon];
        if (!weapon || weapon.type !== 'ranged') return null;

        this.rangedCooldownTimer = weapon.cooldown;
        audio.sfx.rangedShoot();

        var spd = weapon.speed || 250;
        var vx = this.facing === 'right' ? spd : -spd;

        var projType = 'stone';
        if (this.rangedWeapon === 'slingshot') projType = 'slingshot';
        else if (this.rangedWeapon === 'advSling') projType = 'advSling';
        else if (this.rangedWeapon === 'obSpear') projType = 'obSpear';

        return new Projectile({
            x: this.facing === 'right' ? this.x + this.w : this.x - 10,
            y: this.y + this.h * 0.35,
            vx: vx,
            vy: -30,
            dmg: weapon.dmg,
            owner: 'player',
            type: projType,
            w: 10,
            h: 10
        });
    }

    takeDamage(amount) {
        if (this.invincibleTimer > 0) return;
        if (this.state === 'dead') return;

        this.hp -= amount;
        this.hurtTimer = 400;
        this.invincibleTimer = 1500;
        this.state = 'hurt';
        audio.sfx.playerHurt();

        // Knockback
        this.vy = -150;

        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    die() {
        this.lives--;
        this.state = 'dead';

        if (this.lives > 0) {
            // Respawn after short delay
            var self = this;
            setTimeout(function() {
                self.respawn();
            }, 1200);
        } else {
            // Game over
            if (typeof onPlayerDied === 'function') {
                setTimeout(function() {
                    onPlayerDied();
                }, 1200);
            }
        }
    }

    respawn() {
        this.x = CANVAS_W / 2 - 18;
        this.y = GROUND_Y - this.h;
        this.vx = 0;
        this.vy = 0;
        this.hp = this.maxHp;
        this.state = 'idle';
        this.hurtTimer = 0;
        this.invincibleTimer = 2000; // brief invincibility on respawn
    }

    _collectItem(item) {
        if (item.type === 'potion') {
            var heal = item.healAmount || 25;
            this.hp = Math.min(this.maxHp, this.hp + heal);
            item.active = false;
            audio.sfx.potion();
        }
    }

    applyWeaponChoice(choice) {
        // choice is {label, sublabel, melee, ranged, statA, statB}
        // upgrades BOTH weapons at once
        var meleeWeap = WEAPONS[choice.melee];
        var rangedWeap = WEAPONS[choice.ranged];

        if (meleeWeap) {
            this.meleeWeapon = choice.melee;
            if (meleeWeap.hpBonus) {
                this.maxHp += meleeWeap.hpBonus;
                this.hp = Math.min(this.hp + meleeWeap.hpBonus, this.maxHp);
            }
        }
        if (rangedWeap) {
            this.rangedWeapon = choice.ranged;
        }
    }

    draw(ctx) {
        if (this.state === 'dead') return;

        // Flicker when invincible
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 100) % 2 === 0) {
            ctx.globalAlpha = 0.3;
        }

        drawPlayer(ctx, this.x, this.y, this.charLevel, this.animFrame, this.facing);

        ctx.globalAlpha = 1.0;

        // HP bar shown above player when hurt
        if (this.hurtTimer > 0 || this.invincibleTimer > 0) {
            this._drawHpBar(ctx);
        }
    }

    _drawHpBar(ctx) {
        var barW = this.w + 10;
        var barH = 5;
        var bx = this.x - 5;
        var by = this.y - 10;
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
